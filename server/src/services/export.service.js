const { Parser } = require('json2csv');

/**
 * Converts an array of order documents to a CSV string.
 * @param {Array} orders - Array of Mongoose Order documents (plain objects)
 * @returns {string} CSV string
 */
const exportOrdersToCSV = (orders) => {
  const fields = [
    { label: 'Order Number', value: 'orderNumber' },
    { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString('en-IN') },
    { label: 'Customer Name', value: 'customer.name' },
    { label: 'Phone', value: 'customer.phone' },
    { label: 'Address', value: 'customer.address' },
    { label: 'Note', value: 'customer.note' },
    {
      label: 'Items',
      value: (row) =>
        row.items.map((i) => `${i.name} x${i.quantity}`).join(' | '),
    },
    { label: 'Total (₹)', value: 'totalAmount' },
    { label: 'Status', value: 'status' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(orders);
};

module.exports = { exportOrdersToCSV };
