import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  MessageCircle,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronDown,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportOrdersToCSV } from '../../utils/exportUtils';
import { generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.customer.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders to export.', 'warning');
      return;
    }
    exportOrdersToCSV(filteredOrders);
    showToast(`Exported ${filteredOrders.length} orders to CSV successfully!`, 'success');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to ${newStatus.toUpperCase()}`, 'success');
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const text = `Namaste ${order.customer.name}! 👋 This is VANA Artisan team regarding your order #${order.orderNumber} (Total: ${formatCurrency(
      order.totalAmount
    )}).\n\nYour order is currently *${order.status.toUpperCase()}*. We are checking shipping dispatch for your delivery address (${order.customer.city}, PIN: ${order.customer.pincode}). Please let us know if you have any questions!`;
    const url = generateWhatsAppUrl(order.customer.phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD0] shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7E6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone, City..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
          />
        </div>

        {/* Filter and CSV Export Buttons */}
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export CSV Button (FR-20) */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#3B362F] hover:bg-[#25211C] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-sm active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFD0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8DFD0] text-[#7A6D5C] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer & Location</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status & Actions</th>
                <th className="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8C7E6C]">
                    No orders match your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    
                    {/* Order Details */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-[#8C5E3C] block">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#8C7E6C]">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#241F18] block">{order.customer.name}</span>
                      <span className="text-[#8C7E6C] text-[11px]">
                        +91 {order.customer.phone} • {order.customer.city}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-[#241F18]">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} bags
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[11px] text-[#8C5E3C] underline hover:text-[#5E3B20]"
                        >
                          View
                        </button>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sm text-[#241F18] block">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-[#8C7E6C]">Excl. shipping</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : order.status === 'confirmed'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.status === 'cancelled'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-300'
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✓ Confirmed</option>
                        <option value="processing">⚙ Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">🎉 Delivered</option>
                        <option value="cancelled">✕ Cancelled</option>
                      </select>
                    </td>

                    {/* WhatsApp Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleWhatsAppCustomer(order)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors inline-flex items-center space-x-1 border border-emerald-200"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full border border-[#E8DFD0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
              <div>
                <span className="text-xs text-[#8C7E6C]">Order Overview</span>
                <h3 className="font-serif-display font-bold text-lg text-[#241F18]">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#8C7E6C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DAC8] space-y-2 text-xs">
              <h4 className="font-bold text-[#241F18] uppercase tracking-wider text-[11px]">
                Shipping & Contact Info
              </h4>
              <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
              <p><strong>WhatsApp:</strong> +91 {selectedOrder.customer.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
              {selectedOrder.customer.note && (
                <p className="italic text-[#8C5E3C]"><strong>Customer Note:</strong> "{selectedOrder.customer.note}"</p>
              )}
              {selectedOrder.customer.giftWrap && (
                <p className="text-emerald-800 font-semibold">🎁 Gift Wrapping Requested</p>
              )}
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#241F18] uppercase tracking-wider text-xs">
                Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-12 object-cover rounded-lg bg-white border"
                      />
                      <div>
                        <p className="font-bold text-[#241F18]">{item.name}</p>
                        <p className="text-[#8C7E6C]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#241F18]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#E8DFD0] flex justify-between text-sm font-bold text-[#241F18]">
              <span>Total Product Value</span>
              <span className="text-base text-[#8C5E3C]">{formatCurrency(selectedOrder.totalAmount)}</span>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleWhatsAppCustomer(selectedOrder)}
                className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Customer</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
