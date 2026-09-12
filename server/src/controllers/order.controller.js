const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { buildWhatsAppUrl } = require('../services/whatsapp.service');
const { exportOrdersToCSV } = require('../services/export.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// POST /api/orders — Create order from cart data, return WhatsApp link
const createOrder = async (req, res) => {
  const { customer, items } = req.body;

  // Fetch current product data to build price snapshot
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== productIds.length) {
    return sendError(res, 'One or more products are unavailable.', 400);
  }

  const productMap = {};
  products.forEach((p) => { productMap[p._id.toString()] = p; });

  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const product = productMap[item.product];
    // Use effective discounted price for snapshot
    const effectivePrice =
      product.discountPercent > 0
        ? parseFloat((product.price - (product.price * product.discountPercent) / 100).toFixed(2))
        : product.price;

    totalAmount += effectivePrice * item.quantity;
    return {
      product: product._id,
      name: product.name,
      price: effectivePrice,
      quantity: item.quantity,
      image: product.images?.[0] || '',
    };
  });

  const order = await Order.create({
    customer,
    items: orderItems,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    sessionToken: req.session?.sessionToken,
    whatsappMessageSent: true,
  });

  // Clear cart after order placed
  if (req.session) {
    req.session.cartItems = [];
    await req.session.save();
  }

  const whatsappUrl = buildWhatsAppUrl(order);

  return sendSuccess(
    res,
    { order: { orderNumber: order.orderNumber, totalAmount: order.totalAmount }, whatsappUrl },
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
    .sort(sortOptions[sort] || sortOptions.newest)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);
  return sendSuccess(res, { orders, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};

// GET /api/admin/orders/:id — Single order details
const adminGetOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return sendError(res, 'Order not found.', 404);
  return sendSuccess(res, { order });
};

// PUT /api/admin/orders/:id/status — Update order status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 422);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) return sendError(res, 'Order not found.', 404);
  return sendSuccess(res, { order }, `Order status updated to ${status}`);
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

module.exports = { createOrder, adminGetOrders, adminGetOrderById, updateOrderStatus, exportOrders };
