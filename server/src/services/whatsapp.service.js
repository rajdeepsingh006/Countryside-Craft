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
*Subtotal:* ₹${order.totalAmount.toLocaleString('en-IN')}
⚠️ Shipping charges are extra and will be confirmed.

Please confirm this order and let me know the delivery charges. Thank you! 🙏
`.trim();

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encoded}`;
};

module.exports = { buildWhatsAppUrl };
