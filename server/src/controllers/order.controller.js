const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { buildWhatsAppUrl } = require('../services/whatsapp.service');
const { exportOrdersToCSV } = require('../services/export.service');
const { calculateShipping, getOrInitShippingRates } = require('../services/shipping.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const { getRazorpayClient } = require('./payment.controller');
const { RAZORPAY_KEY_ID } = require('../config/env');

/**
 * Restores product stock when an order is cancelled or payment fails.
 * Idempotent via order.stockRestored flag.
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
 * Background auto-cancellation of pending_payment orders older than 30 minutes.
 * Automatically restores reserved inventory.
 */
const cleanupExpiredOrders = async () => {
  try {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const expiredOrders = await Order.find({
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: { $lt: thirtyMinsAgo },
    });

    for (const order of expiredOrders) {
      order.status = 'cancelled';
      order.paymentStatus = 'failed';
      await restoreOrderStock(order);
      await order.save();
      console.log(`[Order Cleanup] Auto-cancelled expired pending_payment order: ${order.orderNumber}`);
    }
  } catch (err) {
    console.error('[Order Cleanup] Error during expired orders cleanup:', err);
  }
};

// POST /api/orders — Server-authoritative order creation from cart data
const createOrder = async (req, res) => {
  const { customer, items, paymentMethod = 'whatsapp', giftWrap = false } = req.body;

  // 1. Fetch current active product data to build price snapshot & stock check
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== productIds.length) {
    return sendError(res, 'One or more products are unavailable.', 400);
  }

  const productMap = {};
  products.forEach((p) => { productMap[p._id.toString()] = p; });

  // 2. Pre-check stock
  for (const item of items) {
    const product = productMap[item.product];
    if (typeof product.stock === 'number' && product.stock < item.quantity) {
      return sendError(
        res,
        `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
        400
      );
    }
  }

  // 3. Atomic stock decrement with rollback on concurrent stock exhaustion
  const decrementedProductIds = [];
  for (const item of items) {
    const updateRes = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );
    if (updateRes.modifiedCount === 0) {
      // Rollback previously decremented items
      for (const dec of decrementedProductIds) {
        await Product.updateOne({ _id: dec.id }, { $inc: { stock: dec.quantity } });
      }
      return sendError(
        res,
        `Insufficient stock for one or more items. Please refresh and try again.`,
        400
      );
    }
    decrementedProductIds.push({ id: item.product, quantity: item.quantity });
  }

  // 4. Server computes all prices authoritatively (actual product price, not reduced)
  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const product = productMap[item.product];
    // Product price is the actual selling price (no deduction)
    const effectivePrice = product.price;

    totalAmount += effectivePrice * item.quantity;
    return {
      product: product._id,
      name: product.name,
      price: effectivePrice,
      quantity: item.quantity,
      image: product.images?.[0] || '',
    };
  });

  const cartItemsForShipping = items.map((item) => {
    const product = productMap[item.product];
    return {
      weightGrams: product.weightGrams || 150,
      quantity: item.quantity,
    };
  });

  const rateDoc = await getOrInitShippingRates();
  const shippingResult = calculateShipping({
    state: customer.state,
    city: customer.city,
    pincode: customer.pincode,
    cartItems: cartItemsForShipping,
    rateDoc,
  });

  const shippingCharge = shippingResult.charge || 0;
  const giftWrapCharge = giftWrap ? 50 : 0;
  const grandTotal = parseFloat((totalAmount + shippingCharge + giftWrapCharge).toFixed(2));

  // Determine initial status based on payment method
  const isRazorpay = paymentMethod === 'razorpay';
  const initialStatus = isRazorpay ? 'pending_payment' : 'payment_pending_manual';
  const initialPaymentStatus = isRazorpay ? 'pending' : 'pending_manual';

  const order = await Order.create({
    customer,
    items: orderItems,
    giftWrap: Boolean(giftWrap),
    shippingCharge,
    shippingZone: shippingResult.zoneLabel || shippingResult.zone,
    totalWeightGrams: shippingResult.totalGrams,
    shipping: {
      weightGrams: shippingResult.totalGrams,
      zone: shippingResult.zone,
      charge: shippingCharge,
    },
    totalAmount: grandTotal,
    paymentMethod,
    paymentStatus: initialPaymentStatus,
    status: initialStatus,
    sessionToken: req.session?.sessionToken,
    whatsappMessageSent: paymentMethod === 'whatsapp',
  });

  let razorpayOrderId = null;
  if (isRazorpay) {
    try {
      const razorpay = getRazorpayClient();
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(grandTotal * 100),
        currency: 'INR',
        receipt: `rcpt_${order.orderNumber || order._id.toString().slice(-8)}`,
        notes: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
        },
      });
      order.razorpayOrderId = rzpOrder.id;
      razorpayOrderId = rzpOrder.id;
      await order.save();
    } catch (rzpErr) {
      console.error('Failed to create Razorpay order for internal order:', rzpErr);
      // Roll back order and restore stock if Razorpay initialization fails
      await restoreOrderStock(order);
      order.status = 'cancelled';
      await order.save();
      return sendError(res, 'Failed to initialize payment gateway for this order.', 500);
    }
  }

  // Clear cart in session after order placed
  if (req.session) {
    req.session.cartItems = [];
    await req.session.save();
  }

  const whatsappUrl = paymentMethod === 'whatsapp' ? buildWhatsAppUrl(order) : null;

  return sendSuccess(
    res,
    {
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
      razorpayOrderId,
      razorpayKeyId: RAZORPAY_KEY_ID,
      whatsappUrl,
    },
    'Order created successfully',
    201
  );
};

// ─── ADMIN ──────────────────────────────────────────────────────

// GET /api/admin/orders — List orders with filter/sort
const adminGetOrders = async (req, res) => {
  const { page = 1, limit = 20, status, search, startDate, endDate, sort = 'newest' } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } },
    ];
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    amount_desc: { totalAmount: -1 },
    amount_asc: { totalAmount: 1 },
  };

  const orders = await Order.find(filter)
    .populate('manualPayment.markedBy', 'username role')
    .sort(sortOptions[sort] || sortOptions.newest)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);
  return sendSuccess(res, { orders, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};

// GET /api/admin/orders/:id — Single order details
const adminGetOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('manualPayment.markedBy', 'username role');
  if (!order) return sendError(res, 'Order not found.', 404);
  return sendSuccess(res, { order });
};

// PUT /api/admin/orders/:id/status — Update order status (with stock restoration on cancellation)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    'pending',
    'pending_payment',
    'payment_pending_manual',
    'pending_whatsapp',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
  ];
  if (!validStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 422);
  }

  const order = await Order.findById(req.params.id);
  if (!order) return sendError(res, 'Order not found.', 404);

  order.status = status;
  if (status === 'cancelled') {
    await restoreOrderStock(order);
  }
  await order.save();

  return sendSuccess(res, { order }, `Order status updated to ${status}`);
};

// PUT /api/admin/orders/:id/mark-paid — Manual confirmation for UPI/WhatsApp orders
const markOrderPaidManual = async (req, res) => {
  const { utrReference = '', notes = '' } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return sendError(res, 'Order not found.', 404);

  if (order.paymentStatus === 'paid') {
    return sendError(res, 'Order is already marked as paid.', 400);
  }

  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.manualPayment = {
    markedBy: req.admin?._id,
    markedAt: new Date(),
    utrReference: String(utrReference).trim(),
    notes: String(notes).trim(),
  };

  await order.save();
  return sendSuccess(
    res,
    {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      manualPayment: order.manualPayment,
    },
    'Order marked as paid manually.'
  );
};

// GET /api/admin/orders/export — Export to CSV
const exportOrders = async (req, res) => {
  const { startDate, endDate, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  const csv = exportOrdersToCSV(orders);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=countryside-craft-orders-${Date.now()}.csv`
  );
  return res.send(csv);
};

module.exports = {
  createOrder,
  adminGetOrders,
  adminGetOrderById,
  updateOrderStatus,
  markOrderPaidManual,
  exportOrders,
  restoreOrderStock,
  cleanupExpiredOrders,
};
