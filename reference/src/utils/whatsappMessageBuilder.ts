import { Order } from '../types';
import { formatCurrency } from './formatters';

/**
 * Builds a structured, beautifully formatted WhatsApp order message
 * that gets pre-filled when redirected to the business owner.
 */
export const buildWhatsAppOrderMessage = (order: Order, storeName = 'VANA Artisan Tote Co.'): string => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join('\n\n');

  const message = `🛍️ *NEW ORDER - ${storeName.toUpperCase()}*
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
💰 *Subtotal:* ${formatCurrency(order.subtotal)}
${order.discount > 0 ? `🏷️ *Discount:* -${formatCurrency(order.discount)}\n` : ''}💵 *Total Product Amount:* ${formatCurrency(order.totalAmount)}
⚠️ *Note:* Shipping & delivery charges will be calculated and confirmed via this chat.

Please share your payment details (UPI/Bank Transfer/QR Code) and estimated dispatch date. Thank you! 🙏`;

  return message;
};

/**
 * Generates the full WhatsApp Click-to-Chat URL
 */
export const generateWhatsAppUrl = (
  phone: string,
  message: string
): string => {
  // Clean phone number (remove +, spaces, hyphens)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

/**
 * Builds quick inquiry messages for floating button
 */
export const buildWhatsAppInquiryMessage = (topic?: string, productName?: string): string => {
  if (productName) {
    return `Hello VANA Team! 👋 I am browsing your website and interested in "${productName}". Could you please share more details about stock, fabric GSM, and custom bulk printing?`;
  }
  if (topic === 'custom-bulk') {
    return `Hello VANA Team! 👋 I am interested in custom bulk tote bag printing for a wedding / corporate gifting event. Could you please share minimum order quantities, pricing catalog, and lead time?`;
  }
  return `Hello VANA Team! 👋 I am browsing your handcrafted tote bag collection and have a question regarding an order / shipping.`;
};
