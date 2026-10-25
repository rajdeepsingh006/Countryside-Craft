/**
 * Countryside Craft — Announcement Configuration & Data Model
 * 
 * Defines typed announcement campaigns with priority ordering,
 * campaign scheduling (ISO 8601), and validation helpers.
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id - Unique identifier
 * @property {string} text - Primary announcement copy
 * @property {string} [mobileText] - Optional compact copy for mobile viewports
 * @property {string} [href] - Target URL or route path (e.g. '/products')
 * @property {string} [view] - Target SPA view identifier (e.g. 'products', 'about')
 * @property {string} [ctaLabel] - Optional button or link label (e.g. 'Shop Now')
 * @property {string} [startsAt] - ISO 8601 timestamp for scheduled start
 * @property {string} [endsAt] - ISO 8601 timestamp for scheduled expiration
 * @property {number} [priority] - Ordering weight (higher number = earlier in rotation)
 * @property {boolean} enabled - Whether the announcement is active
 */

export const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'announcement-free-shipping',
    text: 'Free shipping on orders above ₹999',
    mobileText: 'Free shipping on orders above ₹999',
    href: '/products',
    view: 'products',
    ctaLabel: 'Shop Now',
    priority: 10,
    enabled: true,
  },
  {
    id: 'announcement-handmade-sustainable',
    text: 'Handmade with love · Sustainably yours',
    mobileText: 'Handmade with love · Sustainably yours',
    priority: 8,
    enabled: true,
  },
  {
    id: 'announcement-custom-gifting',
    text: 'Custom & bulk gifting enquiries welcome',
    mobileText: 'Custom & bulk gifting enquiries welcome',
    href: '/about',
    view: 'about',
    ctaLabel: 'Enquire',
    priority: 6,
    enabled: true,
  },
];

/**
 * Validates and filters eligible announcements based on:
 * 1. Enabled status
 * 2. Campaign scheduling timestamps (startsAt / endsAt) with graceful date parsing
 * 3. Priority descending sort order
 * 
 * @param {Announcement[]} announcements
 * @param {Date} [referenceTime] - Optional reference date (defaults to current time)
 * @returns {Announcement[]}
 */
export function getActiveAnnouncements(announcements = DEFAULT_ANNOUNCEMENTS, referenceTime = new Date()) {
  if (!Array.isArray(announcements)) return [];

  const nowTimestamp = referenceTime.getTime();

  return announcements
    .filter((item) => {
      if (!item || typeof item !== 'object') return false;
      if (!item.enabled) return false;
      if (!item.text || typeof item.text !== 'string' || item.text.trim() === '') return false;

      // Validate startsAt if specified
      if (item.startsAt) {
        try {
          const startTime = new Date(item.startsAt).getTime();
          if (!isNaN(startTime) && nowTimestamp < startTime) {
            return false;
          }
        } catch {
          // Gracefully ignore malformed timestamps
        }
      }

      // Validate endsAt if specified
      if (item.endsAt) {
        try {
          const endTime = new Date(item.endsAt).getTime();
          if (!isNaN(endTime) && nowTimestamp > endTime) {
            return false;
          }
        } catch {
          // Gracefully ignore malformed timestamps
        }
      }

      return true;
    })
    .sort((a, b) => {
      const priorityA = typeof a.priority === 'number' ? a.priority : 0;
      const priorityB = typeof b.priority === 'number' ? b.priority : 0;
      return priorityB - priorityA;
    });
}
