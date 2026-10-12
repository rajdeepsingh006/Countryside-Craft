const Product = require('../models/product.model');
const {
  calculateShipping,
  getOrInitShippingRates,
  updateShippingRates,
  resetShippingRates,
} = require('../services/shipping.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/shipping/calculate
 * Calculate delivery charge based on destination and cart items
 */
const calculate = async (req, res) => {
  try {
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
        (dbProduct ? Number(dbProduct.weightGrams) || 150 : 150);
      const quantity = Number(item.quantity) || 1;
      return { weightGrams, quantity };
    });

    const rateDoc = await getOrInitShippingRates();
    const result = calculateShipping({ state, city, pincode, cartItems, rateDoc });
    return sendSuccess(res, result, 'Shipping calculated successfully');
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return sendError(res, error.message || 'Failed to calculate shipping', 500);
  }
};

/**
 * GET /api/shipping/rates or GET /api/admin/shipping/rates
 * Retrieve current active shipping rates and configuration
 */
const getRates = async (req, res) => {
  try {
    const rates = await getOrInitShippingRates();
    return sendSuccess(res, rates, 'Shipping rates retrieved');
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return sendError(res, 'Failed to fetch shipping rates', 500);
  }
};

/**
 * PUT /api/admin/shipping/rates
 * Update shipping rate table and zone configs (FR-12, FR-13, FR-14, FR-15)
 */
const updateRates = async (req, res) => {
  try {
    const username = req.admin?.username || 'Admin';
    const updated = await updateShippingRates(req.body, username);
    return sendSuccess(res, updated, 'Shipping rates updated successfully');
  } catch (error) {
    console.error('Error updating shipping rates:', error);
    return sendError(res, error.message || 'Failed to update shipping rates', 500);
  }
};

/**
 * POST /api/admin/shipping/rates/reset
 * Restore default August 2026 tariff schedule
 */
const resetRates = async (req, res) => {
  try {
    const username = req.admin?.username || 'Admin';
    const reset = await resetShippingRates(username);
    return sendSuccess(res, reset, 'Shipping rates reset to India Post default tariff');
  } catch (error) {
    console.error('Error resetting shipping rates:', error);
    return sendError(res, error.message || 'Failed to reset shipping rates', 500);
  }
};

module.exports = {
  calculate,
  getRates,
  updateRates,
  resetRates,
};
