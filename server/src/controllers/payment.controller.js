const Razorpay = require('razorpay');
const crypto = require('crypto');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../config/env');
const Order = require('../models/order.model');

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
 * STEP 1: BACKEND - Create Order
 * Endpoint: POST /api/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 * Minimum amount: 100 paise
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Check credentials present
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed: Missing API credentials',
      });
    }

    // Validate amount >= 100 paise
    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum required amount is 100 paise (₹1.00).',
      });
    }

    const razorpay = getRazorpayClient();

    const options = {
      amount: Math.round(numericAmount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);

    // Auth failures
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
      error: error.message || (error.error && error.error.description) || 'Internal server error',
    });
  }
};

/**
 * STEP 3: BACKEND - Verify Signature
 * Endpoint: POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compare generated signature with razorpay_signature
 * Return success only if signatures match
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    // Support standard fields from Razorpay web checkout callback
    const order_id = req.body.razorpay_order_id || req.body.order_id;
    const payment_id = req.body.razorpay_payment_id || req.body.payment_id;
    const signature = req.body.razorpay_signature || req.body.signature;
    const internalOrderId = req.body.orderId || req.body.internalOrderId;

    // Validate missing fields
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields (order_id, payment_id, signature)',
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed: Missing Key Secret in environment',
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    const isMatch = expectedSignature === signature;

    if (!isMatch) {
      // Signature mismatch: return 400, do NOT mark as paid
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch',
      });
    }

    // Mark internal order as paid in database if internal order ID was provided
    let updatedOrder = null;
    if (internalOrderId) {
      try {
        updatedOrder = await Order.findByIdAndUpdate(
          internalOrderId,
          {
            $set: {
              status: 'confirmed',
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              razorpayOrderId: order_id,
              razorpayPaymentId: payment_id,
              razorpaySignature: signature,
            },
          },
          { new: true }
        );
      } catch (dbErr) {
        console.warn('Could not update order in database:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment_id,
      order_id,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Razorpay verify-payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message || 'Internal server error',
    });
  }
};
