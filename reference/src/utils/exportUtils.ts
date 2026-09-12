import { Order } from '../types';
import { formatDate } from './formatters';

/**
 * Exports orders to a downloadable CSV file
 */
export const exportOrdersToCSV = (orders: Order[], filename = 'vana-artisan-orders.csv') => {
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Phone',
    'Email',
    'Address',
    'City',
    'State',
    'Pincode',
    'Items Summary',
    'Total Items Qty',
    'Total Amount (INR)',
    'Status',
    'Customer Note',
    'Gift Wrap'
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.name} (Qty: ${item.quantity})`)
      .join('; ');
    const totalQty = order.items.reduce((acc, curr) => acc + curr.quantity, 0);

    return [
      `"${order.orderNumber}"`,
      `"${formatDate(order.createdAt)}"`,
      `"${order.customer.name.replace(/"/g, '""')}"`,
      `"${order.customer.phone}"`,
      `"${order.customer.email || ''}"`,
      `"${order.customer.address.replace(/"/g, '""')}"`,
      `"${order.customer.city}"`,
      `"${order.customer.state}"`,
      `"${order.customer.pincode}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      totalQty,
      order.totalAmount,
      `"${order.status.toUpperCase()}"`,
      `"${(order.customer.note || '').replace(/"/g, '""')}"`,
      order.customer.giftWrap ? 'Yes' : 'No'
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
