import { formatDate } from './formatters';
import * as XLSX from 'xlsx';

// ─── CSV Export ───────────────────────────────────────────────────
export const exportOrdersToCSV = (orders, filename = 'countryside-craft-orders.csv') => {
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Phone',
    'City',
    'State',
    'PIN Code',
    'Full Address',
    'Items Summary',
    'Total Items Qty',
    'Total Amount (INR)',
    'Status',
    'Gift Wrap',
    'Customer Note',
  ];

  const rows = orders.map((order) => {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.name} (Qty: ${item.quantity} × ₹${item.price})`)
      .join('; ');
    const totalQty = (order.items || []).reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const c = order.customer || {};

    return [
      `"${order.orderNumber || ''}"`,
      `"${formatDate(order.createdAt)}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.phone || ''}"`,
      `"${c.city || ''}"`,
      `"${c.state || ''}"`,
      `"${c.pincode || ''}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      totalQty,
      order.totalAmount,
      `"${(order.status || 'pending').toUpperCase()}"`,
      order.giftWrap ? 'Yes' : 'No',
      `"${(c.note || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Excel Export (FR-25) ─────────────────────────────────────────
export const exportOrdersToExcel = (orders, filename = 'countryside-craft-orders.xlsx') => {
  const rows = orders.map((order) => {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.name} (Qty: ${item.quantity} × ₹${item.price})`)
      .join('; ');
    const totalQty = (order.items || []).reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const c = order.customer || {};

    return {
      'Order #': order.orderNumber || '',
      Date: formatDate(order.createdAt),
      'Customer Name': c.name || '',
      Phone: c.phone || '',
      City: c.city || '',
      State: c.state || '',
      'PIN Code': c.pincode || '',
      'Full Address': c.address || '',
      'Items Summary': itemsSummary,
      'Total Qty': totalQty,
      'Total Amount (₹)': order.totalAmount,
      Status: (order.status || 'pending').toUpperCase(),
      'Gift Wrap': order.giftWrap ? 'Yes' : 'No',
      'Customer Note': c.note || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-size columns
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r) => String(r[key] || '').length), 10),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  XLSX.writeFile(workbook, filename);
};

// ─── Customer CSV Export ─────────────────────────────────────────
export const exportCustomersToCSV = (orders, filename = 'countryside-craft-customers.csv') => {
  // Deduplicate by phone number
  const customerMap = new Map();
  orders.forEach((order) => {
    const phone = order.customer?.phone;
    if (phone && !customerMap.has(phone)) {
      customerMap.set(phone, {
        phone,
        name: order.customer?.name || '',
        city: order.customer?.city || '',
        state: order.customer?.state || '',
        pincode: order.customer?.pincode || '',
        firstOrderDate: formatDate(order.createdAt),
        totalOrders: 0,
        totalSpend: 0,
      });
    }
    if (phone) {
      const c = customerMap.get(phone);
      c.totalOrders++;
      c.totalSpend += order.totalAmount || 0;
    }
  });

  const customers = Array.from(customerMap.values());
  const headers = ['Name', 'Phone', 'City', 'State', 'PIN', 'First Order', 'Total Orders', 'Total Spent (₹)'];
  const rows = customers.map((c) => [
    `"${c.name}"`, `"${c.phone}"`, `"${c.city}"`, `"${c.state}"`,
    `"${c.pincode}"`, `"${c.firstOrderDate}"`, c.totalOrders, c.totalSpend.toFixed(2),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
