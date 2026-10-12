const { ADMIN_WHATSAPP_NUMBER } = require('../config/env');

/**
 * Builds a pre-filled WhatsApp wa.me URL from an order object.
 * @param {Object} order - Mongoose Order document
 * @returns {string} Full wa.me URL with encoded message
 */
const buildWhatsAppUrl = (order) => {
  const itemLines = order.items
    .map(
      (item) =>
        `  • ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  const message = `
🛍️ *New Order — Countryside Craft*
━━━━━━━━━━━━━━━━━━━━
*Order Number:* ${order.orderNumber}

*Customer Details:*
  Name: ${order.customer.name}
  Phone: ${order.customer.phone}
  Address: ${order.customer.address}
${order.customer.note ? `  Note: ${order.customer.note}` : ''}

*Items Ordered:*
${itemLines}

━━━━━━━━━━━━━━━━━━━━
💰 *Products Subtotal:* ₹${(order.totalAmount - (order.shippingCharge || 0)).toLocaleString('en-IN')}
🚚 *Speed Post Delivery (${order.shippingZone || 'Zone'} | ~${order.totalWeightGrams || 0}g):* ₹${(order.shippingCharge || 0).toLocaleString('en-IN')}
💵 *Final Order Total:* ₹${order.totalAmount.toLocaleString('en-IN')}
Payment: UPI QR (customer-confirmed, please verify)
✓ Speed Post delivery fee calculated automatically for ${order.customer.state || 'destination'}.

Please confirm receipt of order & dispatch schedule. Thank you! 🙏
`.trim();

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encoded}`;
};

module.exports = { buildWhatsAppUrl };
