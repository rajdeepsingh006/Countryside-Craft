import { formatCurrency } from './formatters';

const STORE_NAME = 'Countryside Craft';
const WHATSAPP_NUMBER = '917009361881';

export const buildWhatsAppOrderMessage = (order) => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}`
    )
    .join('\n\n');

  return `🛍️ *NEW ORDER - ${STORE_NAME.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderNumber}
📅 *Date:* ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
${order.customer.email ? `• *Email:* ${order.customer.email}\n` : ''}• *Delivery Address:* 
  ${order.customer.address}, 
  ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
${order.customer.note ? `• *Customer Note:* "${order.customer.note}"\n` : ''}${order.customer.giftWrap ? `• *Gift Packaging:* Yes (Please pack with gift wrap & ribbon)\n` : ''}
🛒 *ORDER ITEMS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *Product Subtotal:* ${formatCurrency(order.subtotal)}
${order.discount > 0 ? `🏷️ *Discount:* -${formatCurrency(order.discount)}\n` : ''}🚚 *Speed Post Delivery (${order.shippingZone || 'Speed Post'} | ~${order.totalWeightGrams || 0}g):* ${formatCurrency(order.shippingCharge || 0)}
💵 *Total Amount:* ${formatCurrency(order.finalTotal || (order.subtotal + (order.shippingCharge || 0)))}
Payment: ${order.paymentMode === 'razorpay' ? 'Razorpay (Paid Online)' : 'UPI QR (customer-confirmed, please verify)'}
✓ Speed Post postage auto-calculated for ${order.customer.state || 'destination'}.

Please confirm receipt of order & dispatch schedule. Thank you! 🙏`;
};

export const generateWhatsAppUrl = (phone, message) => {
  const cleanPhone = (phone || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const buildWhatsAppInquiryMessage = (topic, productName) => {
  if (productName) {
    return `Hello ${STORE_NAME} Team! 👋 I am browsing your website and interested in "${productName}". Could you please share more details about stock, fabric GSM, and custom bulk printing?`;
  }
  if (topic === 'custom-bulk') {
    return `Hello ${STORE_NAME} Team! 👋 I am interested in custom bulk tote bag printing for a wedding / corporate gifting event. Could you please share minimum order quantities, pricing catalog, and lead time?`;
  }
  return `Hello ${STORE_NAME} Team! 👋 I am browsing your handcrafted tote bag collection and have a question regarding an order / shipping.`;
};
