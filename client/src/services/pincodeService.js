import { INDIAN_STATES } from '../data/indianStates';

/**
 * Matches a state string against standard INDIAN_STATES list (case-insensitive & alias tolerant)
 */
export function normalizeStateName(rawState = '') {
  if (!rawState) return '';
  const clean = rawState.trim().toLowerCase();

  // Handle common aliases/variations
  if (clean.includes('delhi')) return 'Delhi';
  if (clean.includes('chandigarh')) return 'Chandigarh';
  if (clean.includes('orissa')) return 'Odisha';
  if (clean.includes('pondicherry') || clean.includes('puducherry')) return 'Puducherry';
  if (clean.includes('jammu') || clean.includes('kashmir')) return 'Jammu and Kashmir';
  if (clean.includes('daman') || clean.includes('diu') || clean.includes('dadra')) {
    return 'Dadra and Nagar Haveli and Daman and Diu';
  }

  const matched = INDIAN_STATES.find(
    (s) => s.toLowerCase() === clean || clean.includes(s.toLowerCase())
  );
  return matched || rawState.trim();
}

/**
 * Look up City (District) and State for a 6-digit Indian PIN code
 * @param {string} pincode - 6-digit postal code
 * @returns {Promise<{ city: string, state: string, district: string, postOffice: string } | null>}
 */
export async function lookupPincode(pincode) {
  const cleanPin = String(pincode || '').replace(/[^0-9]/g, '');
  if (cleanPin.length !== 6) return null;

  // 1. Primary India Post API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const state = normalizeStateName(po.State);
        const city = po.District || po.Block || po.Name || '';
        return {
          city,
          state,
          district: po.District || '',
          postOffice: po.Name || '',
        };
      }
    }
  } catch (err) {
    console.warn('Primary PIN code lookup failed, attempting fallback...', err.message);
  }

  // 2. Fallback Open Source Mirror API
  try {
    const res = await fetch(`https://aniket-thapa.github.io/india-pincode-api/pincodes/${cleanPin}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.state) {
        return {
          city: data.district || data.city || data.division || '',
          state: normalizeStateName(data.state),
          district: data.district || '',
          postOffice: data.officeName || '',
        };
      }
    }
  } catch (err) {
    console.warn('Fallback PIN code lookup also unavailable:', err.message);
  }

  return null;
}
