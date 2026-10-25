import { formatDate } from './formatters';

const getExcelJS = async () => {
  const mod = await import('exceljs');
  return mod.default || mod;
};

const sanitizeForSpreadsheet = (val) => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
};

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
      `"${sanitizeForSpreadsheet(order.orderNumber || '').replace(/"/g, '""')}"`,
      `"${formatDate(order.createdAt)}"`,
      `"${sanitizeForSpreadsheet(c.name || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(c.phone || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(c.city || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(c.state || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(c.pincode || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(c.address || '').replace(/"/g, '""')}"`,
      `"${sanitizeForSpreadsheet(itemsSummary).replace(/"/g, '""')}"`,
      totalQty,
      order.totalAmount,
      `"${(order.status || 'pending').toUpperCase()}"`,
      order.giftWrap ? 'Yes' : 'No',
      `"${sanitizeForSpreadsheet(c.note || '').replace(/"/g, '""')}"`,
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

// ─── Excel Export (FR-25) using ExcelJS ─────────────────────────────
export const exportOrdersToExcel = async (orders, filename = 'countryside-craft-orders.xlsx') => {
  const ExcelJS = await getExcelJS();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.columns = [
    { header: 'Order #', key: 'orderNumber', width: 16 },
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Customer Name', key: 'customerName', width: 22 },
    { header: 'Phone', key: 'phone', width: 16 },
    { header: 'City', key: 'city', width: 16 },
    { header: 'State', key: 'state', width: 16 },
    { header: 'PIN Code', key: 'pincode', width: 12 },
    { header: 'Full Address', key: 'address', width: 30 },
    { header: 'Items Summary', key: 'itemsSummary', width: 35 },
    { header: 'Total Qty', key: 'totalQty', width: 12 },
    { header: 'Total Amount (INR)', key: 'totalAmount', width: 18 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Gift Wrap', key: 'giftWrap', width: 12 },
    { header: 'Customer Note', key: 'customerNote', width: 25 },
  ];

  orders.forEach((order) => {
    const itemsSummary = (order.items || [])
      .map((item) => `${item.name} (Qty: ${item.quantity} × ₹${item.price})`)
      .join('; ');
    const totalQty = (order.items || []).reduce((acc, curr) => acc + (curr.quantity || 0), 0);
    const c = order.customer || {};

    worksheet.addRow({
      orderNumber: sanitizeForSpreadsheet(order.orderNumber || ''),
      date: formatDate(order.createdAt),
      customerName: sanitizeForSpreadsheet(c.name || ''),
      phone: sanitizeForSpreadsheet(c.phone || ''),
      city: sanitizeForSpreadsheet(c.city || ''),
      state: sanitizeForSpreadsheet(c.state || ''),
      pincode: sanitizeForSpreadsheet(c.pincode || ''),
      address: sanitizeForSpreadsheet(c.address || ''),
      itemsSummary: sanitizeForSpreadsheet(itemsSummary),
      totalQty,
      totalAmount: Number(order.totalAmount || 0),
      status: (order.status || 'pending').toUpperCase(),
      giftWrap: order.giftWrap ? 'Yes' : 'No',
      customerNote: sanitizeForSpreadsheet(c.note || ''),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
  const headers = ['Name', 'Phone', 'City', 'State', 'PIN', 'First Order', 'Total Orders', 'Total Spent (INR)'];
  const rows = customers.map((c) => [
    `"${sanitizeForSpreadsheet(c.name).replace(/"/g, '""')}"`,
    `"${sanitizeForSpreadsheet(c.phone).replace(/"/g, '""')}"`,
    `"${sanitizeForSpreadsheet(c.city).replace(/"/g, '""')}"`,
    `"${sanitizeForSpreadsheet(c.state).replace(/"/g, '""')}"`,
    `"${sanitizeForSpreadsheet(c.pincode).replace(/"/g, '""')}"`,
    `"${c.firstOrderDate}"`,
    c.totalOrders,
    c.totalSpend.toFixed(2),
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
