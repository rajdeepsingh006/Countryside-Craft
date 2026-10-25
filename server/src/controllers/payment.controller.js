const Razorpay = require('razorpay');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET } = require('../config/env');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

let razorpayClient = null;

const getRazorpayClient = () => {
  if (!razorpayClient) {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      const err = new Error('Razorpay authentication failed: Missing Key ID or Key Secret in environment');
      err.status = 401;
      throw err;
    }
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
};

/**
 * Restores product stock when payment fails or order is cancelled.
 */
const restoreOrderStock = async (order) => {
  if (!order || order.stockRestored) return;
  for (const item of order.items || []) {
    if (item.product && item.quantity > 0) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }
  }
  order.stockRestored = true;
};

/**
 * STEP 1: BACKEND - Create Razorpay Order tied to an existing internal Order
 * Endpoint: POST /api/create-order or POST /api/payments/create-order
 * Request: { orderId } (Client cannot provide amount; server computes and verifies from DB)
 * Return: { success: true, order_id, amount, currency, key_id }
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required. Payment amounts are server-authoritative and determined by internal order.',
      });
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed: Missing API credentials',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for the given ID.',
      });
    }

    // Recompute / verify amount from order.totalAmount
    const numericAmount = Number(order.totalAmount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total in system.',
      });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const razorpay = getRazorpayClient();

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${order.orderNumber || order._id.toString().slice(-8)}`,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber || '',
        customerPhone: order.customer?.phone || '',
      },
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save razorpayOrderId to internal order
    order.razorpayOrderId = rzpOrder.id;
    order.paymentMethod = 'razorpay';
    order.status = 'pending_payment';
    order.paymentStatus = 'pending';
    await order.save();

    return res.status(200).json({
      success: true,
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);

    if (
      error.status === 401 ||
      error.statusCode === 401 ||
      (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description?.toLowerCase().includes('auth'))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed',
        error: error.message || error.description,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message || 'Internal server error',
    });
  }
};

/**
 * STEP 2: BACKEND - Verify Signature & Amount Integrity
 * Endpoint: POST /api/verify-payment or POST /api/payments/verify
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Accepts only { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Finds Order strictly by razorpayOrderId, never by client internal ID.
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const razorpay_order_id = req.body.razorpay_order_id || req.body.order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.payment_id;
    const razorpay_signature = req.body.razorpay_signature || req.body.signature;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)',
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed: Missing Key Secret in environment',
      });
    }

    // Find the internal order strictly by razorpayOrderId
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found matching the provided Razorpay order ID.',
      });
    }

    // 1. Timing-safe cryptographic signature comparison (Buffer comparison)
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();
    const given = Buffer.from(razorpay_signature, 'hex');

    const ok = expected.length === given.length && crypto.timingSafeEqual(expected, given);
    if (!ok) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch.',
      });
    }

    // 2. Fetch payment from Razorpay (payments.fetch) and confirm amount, currency, status
    try {
      const razorpay = getRazorpayClient();
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      const expectedAmountPaise = Math.round(order.totalAmount * 100);

      if (paymentDetails.amount !== expectedAmountPaise) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount mismatch.',
        });
      }

      if (paymentDetails.currency !== 'INR') {
        return res.status(400).json({
          success: false,
          message: 'Currency mismatch.',
        });
      }

      if (!['captured', 'authorized'].includes(paymentDetails.status)) {
        return res.status(400).json({
          success: false,
          message: `Payment status not captured/authorized (current: ${paymentDetails.status}).`,
        });
      }
    } catch (fetchErr) {
      console.warn('Razorpay payments.fetch verification warning:', fetchErr.message);
    }

    // 3. Conditional idempotent write so repeated call cannot double-process
    // Notice: we do NOT store razorpaySignature as per 1.2
    const updated = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, paymentStatus: { $ne: 'paid' } },
      {
        $set: {
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'razorpay',
          razorpayPaymentId: razorpay_payment_id,
        },
        $unset: {
          razorpaySignature: 1,
        },
      },
      { new: true }
    );

    const finalOrder = updated || order;

    // Return only { orderNumber, status } to the client (not whole order, no error.message)
    return res.status(200).json({
      success: true,
      orderNumber: finalOrder.orderNumber,
      status: finalOrder.status,
    });
  } catch (error) {
    console.error('Razorpay verify-payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
};

/**
 * STEP 3: BACKEND - Razorpay Webhook (Safety Net)
 * Endpoint: POST /api/payments/webhook
 * Receives raw body buffer to verify X-Razorpay-Signature with RAZORPAY_WEBHOOK_SECRET.
 * Handles payment.captured, payment.failed, refund.processed.
 */
exports.handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;
    if (!webhookSecret) {
      console.error('[Webhook] Missing RAZORPAY_WEBHOOK_SECRET');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'] || '';
    if (!signature) {
      return res.status(400).json({ error: 'Missing X-Razorpay-Signature header' });
    }

    // Verify signature against raw body
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const givenBuf = Buffer.from(signature, 'utf8');

    const isValid = expectedBuf.length === givenBuf.length && crypto.timingSafeEqual(expectedBuf, givenBuf);
    if (!isValid) {
      console.warn('[Webhook] Invalid signature received on /api/payments/webhook');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(req.body.toString('utf8'));
    const event = payload.event;
    console.log(`[Webhook] Received Razorpay event: ${event}`);

    if (event === 'payment.captured') {
      const payment = payload.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      const razorpayPaymentId = payment?.id;

      if (razorpayOrderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId, paymentStatus: { $ne: 'paid' } },
          {
            $set: {
              status: 'confirmed',
              paymentStatus: 'paid',
              paymentMethod: 'razorpay',
              razorpayPaymentId,
            },
            $unset: {
              razorpaySignature: 1,
            },
          }
        );
        console.log(`[Webhook] Order with Razorpay ID ${razorpayOrderId} marked paid via webhook.`);
      }
    } else if (event === 'payment.failed') {
      const payment = payload.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId, status: 'pending_payment' });
        if (order) {
          order.status = 'cancelled';
          order.paymentStatus = 'failed';
          await restoreOrderStock(order);
          await order.save();
          console.log(`[Webhook] Order ${order.orderNumber} cancelled and stock restored on payment.failed.`);
        }
      }
    } else if (event === 'refund.processed') {
      const refund = payload.payload?.refund?.entity;
      const paymentId = refund?.payment_id;

      if (paymentId) {
        await Order.findOneAndUpdate(
          { razorpayPaymentId: paymentId },
          { $set: { paymentStatus: 'refunded' } }
        );
        console.log(`[Webhook] Payment ${paymentId} marked as refunded.`);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook] Error processing Razorpay webhook:', err);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
};

exports.getRazorpayClient = getRazorpayClient;
exports.restoreOrderStock = restoreOrderStock;
