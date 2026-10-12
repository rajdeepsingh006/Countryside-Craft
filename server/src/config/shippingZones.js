const STORE_ORIGIN = {
  state: 'Punjab',
  city: 'Sirhind',
  district: 'Fatehgarh Sahib',
  localCities: ['sirhind', 'nandpur kalour', 'fatehgarh sahib', 'sirhind fatehgarh sahib'],
  localPincodes: ['140406', '140407', '140412'],
};

// Neighboring & Metro circles (Speed Post Zone/Metro classification)
const ZONE_METRO_STATES = [
  'delhi',
  'chandigarh',
  'haryana',
  'himachal pradesh',
  'rajasthan',
  'uttar pradesh',
  'maharashtra',
  'karnataka',
  'west bengal',
  'tamil nadu',
  'telangana',
];

/**
 * Determine the Speed Post zone based on destination state, city, and pincode
 * @param {Object} destination - { state, city, pincode }
 * @returns {string} 'local' | 'withinState' | 'zoneMetro' | 'otherStates'
 */
function getShippingZone({ state = '', city = '', pincode = '' }) {
  const normState = String(state || '').trim().toLowerCase();
  const normCity = String(city || '').trim().toLowerCase();
  const normPin = String(pincode || '').trim();

  // 1. Check Local (Sirhind / Fatehgarh Sahib area)
  if (
    STORE_ORIGIN.localPincodes.includes(normPin) ||
    (normState === STORE_ORIGIN.state.toLowerCase() &&
      STORE_ORIGIN.localCities.some((c) => normCity.includes(c)))
  ) {
    return 'local';
  }

  // 2. Check Within State (Punjab)
  if (normState === STORE_ORIGIN.state.toLowerCase()) {
    return 'withinState';
  }

  // 3. Check Zone / Metro States
  if (ZONE_METRO_STATES.includes(normState)) {
    return 'zoneMetro';
  }

  // 4. Default to Other States (safest tier)
  return 'otherStates';
}

const ZONE_LABELS = {
  local: 'Local (Sirhind Area)',
  withinState: 'Within Punjab',
  zoneMetro: 'Zone / Metro',
  otherStates: 'Other States',
};

module.exports = { getShippingZone, STORE_ORIGIN, ZONE_METRO_STATES, ZONE_LABELS };
