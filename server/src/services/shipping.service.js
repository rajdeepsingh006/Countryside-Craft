const { SPEED_POST_RATES } = require('../config/speedPostRates');
const { getShippingZone, ZONE_LABELS } = require('../config/shippingZones');

/**
 * Find the applicable rate row for given total weight
 * @param {number} totalGrams
 */
function getRateForWeight(totalGrams) {
  const safeGrams = Math.max(1, Number(totalGrams) || 250);
  const slab = SPEED_POST_RATES.find((row) => safeGrams <= row.maxGrams);
  return slab || SPEED_POST_RATES[SPEED_POST_RATES.length - 1];
}

/**
 * Calculate Speed Post delivery charges based on destination and cart items
 * @param {Object} params
 * @param {string} params.state
 * @param {string} params.city
 * @param {string} params.pincode
 * @param {Array} params.cartItems - Array of { weightGrams, quantity }
 * @returns {Object} { totalGrams, zone, zoneLabel, charge, slabMaxGrams }
 */
function calculateShipping({ state = '', city = '', pincode = '', cartItems = [] }) {
  const totalGrams = cartItems.reduce((sum, item) => {
    const w = Number(item.weightGrams) || 250;
    const q = Number(item.quantity) || 1;
    return sum + w * q;
  }, 0);

  const zone = getShippingZone({ state, city, pincode });
  const rateRow = getRateForWeight(totalGrams);
  const charge = Number(rateRow[zone]) || 55;

  return {
    totalGrams,
    zone,
    zoneLabel: ZONE_LABELS[zone] || 'Speed Post',
    charge,
    slabMaxGrams: rateRow.maxGrams,
  };
}

module.exports = { calculateShipping, getRateForWeight };
