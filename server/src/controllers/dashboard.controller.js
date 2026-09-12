const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { sendSuccess } = require('../utils/apiResponse');

// GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Run all aggregations in parallel
  const [
    totalOrders,
    thisMonthOrders,
    lastMonthOrders,
    totalProducts,
    lowStockProducts,
    revenueData,
    statusBreakdown,
    topProducts,
    ordersOverTime,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $gt: 0, $lte: 5 } }),

    // Total revenue (all time)
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // Orders by status
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Top 5 best-selling products (by quantity ordered)
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]),

    // Orders over the last 30 days (for chart)
    Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return sendSuccess(res, {
    overview: {
      totalOrders,
      thisMonthOrders,
      lastMonthOrders,
      totalProducts,
      lowStockProducts,
      totalRevenue: revenueData[0]?.total || 0,
    },
    statusBreakdown: statusBreakdown.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {}),
    topProducts,
    ordersOverTime,
  });
};

module.exports = { getDashboardStats };
