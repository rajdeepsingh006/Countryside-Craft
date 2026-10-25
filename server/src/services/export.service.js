const { Parser } = require('@json2csv/plainjs');

const sanitizeForCSV = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
};

/**
 * Converts an array of order documents to a CSV string.
 * @param {Array} orders - Array of Mongoose Order documents (plain objects)
 * @returns {string} CSV string
 */
const exportOrdersToCSV = (orders) => {
  const fields = [
    { label: 'Order Number', value: (row) => sanitizeForCSV(row.orderNumber) },
    { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString('en-IN') },
    { label: 'Customer Name', value: (row) => sanitizeForCSV(row.customer?.name) },
    { label: 'Phone', value: (row) => sanitizeForCSV(row.customer?.phone) },
    { label: 'Address', value: (row) => sanitizeForCSV(row.customer?.address) },
    { label: 'Note', value: (row) => sanitizeForCSV(row.customer?.note) },
    {
      label: 'Items',
      value: (row) =>
        (row.items || [])
          .map((i) => `${sanitizeForCSV(i.name)} x${i.quantity}`)
          .join(' | '),
    },
    { label: 'Total (₹)', value: 'totalAmount' },
    { label: 'Status', value: 'status' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(orders);
};

module.exports = { exportOrdersToCSV };
