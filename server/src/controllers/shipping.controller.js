const Product = require('../models/product.model');
const { calculateShipping } = require('../services/shipping.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/shipping/calculate
 * Calculate delivery charge based on destination and cart items
 */
const calculate = async (req, res) => {
  const { state, city, pincode, items = [] } = req.body;

  if (!items || items.length === 0) {
    return sendSuccess(res, {
      totalGrams: 0,
      zone: 'otherStates',
      zoneLabel: 'Speed Post',
      charge: 0,
    });
  }

  // Extract products from database if productId is provided
  const productIds = items
    .map((i) => i.productId || i.product || i._id)
    .filter(Boolean);

  let productMap = {};
  if (productIds.length > 0) {
    const products = await Product.find({ _id: { $in: productIds } });
    products.forEach((p) => {
      productMap[p._id.toString()] = p;
    });
  }

  const cartItems = items.map((item) => {
    const pId = String(item.productId || item.product || item._id || '');
    const dbProduct = productMap[pId];
    const weightGrams =
      Number(item.weightGrams) ||
      (dbProduct ? Number(dbProduct.weightGrams) || 250 : 250);
    const quantity = Number(item.quantity) || 1;
    return { weightGrams, quantity };
  });

  const result = calculateShipping({ state, city, pincode, cartItems });
  return sendSuccess(res, result, 'Shipping calculated successfully');
};

module.exports = { calculate };
