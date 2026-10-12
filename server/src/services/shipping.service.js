const ShippingRate = require('../models/shippingRate.model');
const { SPEED_POST_RATES } = require('../config/speedPostRates');
const { getShippingZone, ZONE_LABELS, ZONE_METRO_STATES, STORE_ORIGIN } = require('../config/shippingZones');

// Memory cache to avoid DB roundtrips on every calculation
let cachedRates = null;
let lastCacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Get or initialize active shipping rates from database
 */
async function getOrInitShippingRates() {
  const now = Date.now();
  if (cachedRates && now - lastCacheTime < CACHE_TTL) {
    return cachedRates;
  }

  try {
    let rateDoc = await ShippingRate.findOne().sort({ updatedAt: -1 });
    if (!rateDoc) {
      rateDoc = await ShippingRate.create({
        weightSlabs: SPEED_POST_RATES,
        zoneMetroStates: ZONE_METRO_STATES,
        storeOriginState: STORE_ORIGIN.state,
        storeOriginCity: STORE_ORIGIN.city,
        lastUpdatedBy: 'System (Default Tariff)',
        lastUpdatedAt: new Date(),
        previousVersions: [],
      });
    }

    cachedRates = rateDoc;
    lastCacheTime = now;
    return rateDoc;
  } catch (err) {
    console.warn('ShippingRate DB read error, using config fallback:', err.message);
    return {
      weightSlabs: SPEED_POST_RATES,
      zoneMetroStates: ZONE_METRO_STATES,
      storeOriginState: STORE_ORIGIN.state,
      storeOriginCity: STORE_ORIGIN.city,
      lastUpdatedAt: new Date(),
      lastUpdatedBy: 'System Config',
      previousVersions: [],
    };
  }
}

/**
 * Find the applicable rate row for given total weight
 * @param {number} totalGrams
 * @param {Array} slabs
 */
function getRateForWeight(totalGrams, slabs = SPEED_POST_RATES) {
  const safeGrams = Math.max(1, Number(totalGrams) || 150);
  const activeSlabs = Array.isArray(slabs) && slabs.length > 0 ? slabs : SPEED_POST_RATES;
  const slab = activeSlabs.find((row) => safeGrams <= row.maxGrams);
  return slab || activeSlabs[activeSlabs.length - 1];
}

/**
 * Calculate Speed Post delivery charges based on destination and cart items
 * @param {Object} params
 * @param {string} params.state
 * @param {string} params.city
 * @param {string} params.pincode
 * @param {Array} params.cartItems - Array of { weightGrams, quantity }
 * @param {Object} [params.rateDoc] - Optional active rate document
 * @returns {Object} { totalGrams, zone, zoneLabel, charge, slabMaxGrams }
 */
function calculateShipping({ state = '', city = '', pincode = '', cartItems = [], rateDoc = null }) {
  const totalGrams = cartItems.reduce((sum, item) => {
    const w = Number(item.weightGrams) || 150;
    const q = Number(item.quantity) || 1;
    return sum + w * q;
  }, 0);

  const customMetroStates = rateDoc?.zoneMetroStates;
  const zone = getShippingZone({ state, city, pincode, customMetroStates });
  const activeSlabs = rateDoc?.weightSlabs || (cachedRates?.weightSlabs ?? SPEED_POST_RATES);
  const rateRow = getRateForWeight(totalGrams, activeSlabs);
  const charge = Number(rateRow[zone]) || 55;

  return {
    totalGrams,
    zone,
    zoneLabel: ZONE_LABELS[zone] || 'Speed Post',
    charge,
    slabMaxGrams: rateRow.maxGrams,
  };
}

/**
 * Update shipping rate table & metro states in database with version history logging (FR-13, FR-14, FR-15)
 */
async function updateShippingRates(updates, username = 'Admin') {
  let rateDoc = await ShippingRate.findOne().sort({ updatedAt: -1 });
  if (!rateDoc) {
    rateDoc = new ShippingRate();
  }

  // Version history logging (FR-15)
  if (rateDoc.weightSlabs && rateDoc.weightSlabs.length > 0) {
    const versionEntry = {
      savedAt: rateDoc.lastUpdatedAt || new Date(),
      savedBy: rateDoc.lastUpdatedBy || 'Admin',
      note: updates.note || 'Revised Speed Post tariff',
      slabsCount: rateDoc.weightSlabs.length,
      zoneMetroStates: [...(rateDoc.zoneMetroStates || [])],
    };

    if (!rateDoc.previousVersions) rateDoc.previousVersions = [];
    rateDoc.previousVersions.unshift(versionEntry);
    // Keep max 15 previous history logs
    if (rateDoc.previousVersions.length > 15) {
      rateDoc.previousVersions = rateDoc.previousVersions.slice(0, 15);
    }
  }

  if (Array.isArray(updates.weightSlabs)) {
    rateDoc.weightSlabs = updates.weightSlabs;
  }
  if (Array.isArray(updates.zoneMetroStates)) {
    rateDoc.zoneMetroStates = updates.zoneMetroStates.map((s) => s.toLowerCase().trim());
  }
  if (updates.storeOriginState) rateDoc.storeOriginState = updates.storeOriginState;
  if (updates.storeOriginCity) rateDoc.storeOriginCity = updates.storeOriginCity;

  rateDoc.lastUpdatedBy = username;
  rateDoc.lastUpdatedAt = new Date();

  await rateDoc.save();
  cachedRates = rateDoc;
  lastCacheTime = Date.now();
  return rateDoc;
}

/**
 * Reset shipping rates back to India Post default schedule
 */
async function resetShippingRates(username = 'Admin') {
  return updateShippingRates(
    {
      weightSlabs: SPEED_POST_RATES,
      zoneMetroStates: ZONE_METRO_STATES,
      storeOriginState: STORE_ORIGIN.state,
      storeOriginCity: STORE_ORIGIN.city,
      note: 'Reset to official August 2026 India Post tariff',
    },
    username
  );
}

module.exports = {
  calculateShipping,
  getRateForWeight,
  getOrInitShippingRates,
  updateShippingRates,
  resetShippingRates,
};
