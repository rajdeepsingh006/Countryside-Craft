/**
 * Builds a UPI deep-link string for payments.
 * Format: upi://pay?pa={upiId}&pn={payeeName}&am={amount}&cu=INR&tn=Order {orderNumber}&tr={orderNumber}
 *
 * @param {Object} params
 * @param {string} params.upiId - UPI ID of payee/merchant (pa)
 * @param {string} params.payeeName - Payee/Store name (pn)
 * @param {number|string} params.amount - Total order amount in INR (am)
 * @param {string} params.orderNumber - Unique order identifier (tn, tr)
 * @returns {string} Fully encoded UPI deep link
 */
export const buildUpiPaymentLink = ({ upiId, payeeName, amount, orderNumber }) => {
  const formattedAmount = Number(amount || 0).toFixed(2);
  const cleanOrderNumber = String(orderNumber || '').trim();

  const params = new URLSearchParams({
    pa: (upiId || 'yourstorename@oksbi').trim(),
    pn: (payeeName || 'Countryside Craft').trim(),
    am: formattedAmount,
    cu: 'INR',
    tn: `Order ${cleanOrderNumber}`,
    tr: cleanOrderNumber,
  });

  return `upi://pay?${params.toString()}`;
};
