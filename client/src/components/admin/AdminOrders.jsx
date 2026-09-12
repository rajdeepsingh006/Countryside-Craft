import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  FileSpreadsheet,
  MessageCircle,
  ChevronDown,
  X,
  Calendar,
  Filter,
  ArrowUpDown,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportOrdersToCSV, exportOrdersToExcel, exportCustomersToCSV } from '../../utils/exportUtils';
import { generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { adminService } from '../../services/adminService';

const STATUS_STYLES = {
  delivered: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  shipped: 'bg-blue-50 text-blue-800 border-blue-300',
  confirmed: 'bg-[#FDF1F7] text-[#86124F] border-[#EFC0DA]',
  cancelled: 'bg-red-50 text-red-800 border-red-300',
  pending: 'bg-neutral-50 text-neutral-800 border-neutral-300',
  pending_whatsapp: 'bg-orange-50 text-orange-800 border-orange-300',
};

const STATUS_LABELS = {
  pending: '⏳ Pending',
  pending_whatsapp: '💬 WhatsApp Pending',
  confirmed: '✓ Confirmed',
  shipped: '🚚 Shipped',
  delivered: '🎉 Delivered',
  cancelled: '✕ Cancelled',
};

export const AdminOrders = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 200 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (sortBy) params.sort = sortBy;
      const res = await adminService.getOrders(params);
      setOrders(res.orders || res || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      showToast('Could not load orders from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortBy, startDate, endDate]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        (o.orderNumber || '').toLowerCase().includes(q) ||
        (o.customer?.name || '').toLowerCase().includes(q) ||
        (o.customer?.phone || '').includes(q) ||
        (o.customer?.address || '').toLowerCase().includes(q) ||
        (o.customer?.city || '').toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.', 'warning');
      return;
    }
    exportOrdersToCSV(filteredOrders);
    showToast(`Exported ${filteredOrders.length} orders to CSV!`, 'success');
    setExportMenuOpen(false);
  };

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.', 'warning');
      return;
    }
    exportOrdersToExcel(filteredOrders);
    showToast(`Exported ${filteredOrders.length} orders to Excel!`, 'success');
    setExportMenuOpen(false);
  };

  const handleExportCustomers = () => {
    if (filteredOrders.length === 0) {
      showToast('No orders to export.', 'warning');
      return;
    }
    exportCustomersToCSV(filteredOrders);
    showToast('Customer list exported as CSV!', 'success');
    setExportMenuOpen(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus.toUpperCase()}`, 'success');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleWhatsAppCustomer = (order) => {
    const text = `Namaste ${order.customer?.name}! 👋 This is Countryside Craft team regarding your order #${order.orderNumber} (Total: ${formatCurrency(order.totalAmount)}).\n\nYour order is currently *${(order.status || 'pending').toUpperCase()}*. Please let us know if you have any questions!`;
    window.open(generateWhatsAppUrl(order.customer?.phone, text), '_blank', 'noopener,noreferrer');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || sortBy !== 'newest' || startDate || endDate;

  return (
    <div className="space-y-6">

      {/* Header Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['pending', 'confirmed', 'shipped', 'delivered'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === statusFilter ? 'all' : s)}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              statusFilter === s
                ? 'border-[#D91680] bg-[#EEF3FA] shadow-xs'
                : 'bg-white border-[#B9C9E7]/60 hover:border-[#D91680]'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6A758E]">{s}</p>
            <p className="text-xl font-black text-[#1A1F2C]">{orders.filter((o) => o.status === s).length}</p>
          </button>
        ))}
      </div>

      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs space-y-3">

        {/* Row 1: Search + Export */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8E9DBE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, Name, Phone, City, Address..."
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
            />
          </div>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="px-4 py-2.5 rounded-xl bg-[#1A1F2C] hover:bg-[#2C3549] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
            {exportMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#B9C9E7]/60 rounded-2xl shadow-xl z-20 py-1.5 min-w-[180px]">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-xs font-bold text-left text-[#1A1F2C] hover:bg-[#EEF3FA] flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#D91680]" />
                  <span>Orders → CSV</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-2 text-xs font-bold text-left text-[#1A1F2C] hover:bg-[#EEF3FA] flex items-center space-x-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Orders → Excel (.xlsx)</span>
                </button>
                <div className="border-t border-[#EEF3FA] my-1" />
                <button
                  onClick={handleExportCustomers}
                  className="w-full px-4 py-2 text-xs font-bold text-left text-[#1A1F2C] hover:bg-[#EEF3FA] flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Customers → CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#8E9DBE] shrink-0" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">⏳ Pending</option>
            <option value="pending_whatsapp">💬 WhatsApp Pending</option>
            <option value="confirmed">✓ Confirmed</option>
            <option value="shipped">🚚 Shipped</option>
            <option value="delivered">🎉 Delivered</option>
            <option value="cancelled">✕ Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_desc">Amount: High→Low</option>
            <option value="amount_asc">Amount: Low→High</option>
          </select>

          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#8E9DBE]" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
              title="Start Date"
            />
            <span className="text-[#8E9DBE] text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
              title="End Date"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 text-xs rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          <span className="text-xs text-[#6A758E] ml-auto font-semibold">
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EEF3FA]/60 border-b border-[#B9C9E7]/40 text-[#4B566E] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3FA]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6A758E]">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#D91680] border-t-transparent animate-spin" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6A758E]">
                    <Package className="w-8 h-8 mx-auto mb-2 text-[#8E9DBE]" />
                    <p className="font-bold">No orders found</p>
                    <p className="text-[11px] mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#EEF3FA]/30 transition-colors">

                    {/* Order Details */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-[#D91680] block">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#6A758E]">{formatDate(order.createdAt)}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1A1F2C] block">{order.customer?.name}</span>
                      <span className="text-[#6A758E] text-[11px]">
                        +91 {order.customer?.phone}
                        {order.customer?.city ? ` • ${order.customer.city}` : ''}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1A1F2C]">
                          {(order.items || []).reduce((s, i) => s + (i.quantity || 1), 0)} bags
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[11px] text-[#D91680] underline hover:text-[#BE0E6E] font-bold cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-[#1A1F2C] block">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-[#6A758E]">Excl. shipping</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-xl px-2.5 py-1 border cursor-pointer focus:outline-none ${
                          STATUS_STYLES[order.status] || STATUS_STYLES.pending
                        }`}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* WhatsApp Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleWhatsAppCustomer(order)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors inline-flex items-center space-x-1 border border-emerald-200 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl overflow-hidden max-w-xl w-full border border-[#B9C9E7]/60 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3FA]">
              <div>
                <span className="text-xs text-[#6A758E] font-semibold">Order Details</span>
                <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedOrder.status || 'pending'}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className={`text-[11px] font-bold uppercase rounded-xl px-2.5 py-1 border cursor-pointer focus:outline-none ${
                    STATUS_STYLES[selectedOrder.status] || STATUS_STYLES.pending
                  }`}
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-[#6A758E] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-[#EEF3FA]/40 border border-[#B9C9E7]/60 space-y-1.5 text-xs text-[#1A1F2C]">
              <h4 className="font-bold text-[#D91680] uppercase tracking-wider text-[11px] mb-2">
                Customer & Shipping
              </h4>
              <p><strong>Name:</strong> {selectedOrder.customer?.name}</p>
              <p><strong>WhatsApp:</strong> +91 {selectedOrder.customer?.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.customer?.address}</p>
              {selectedOrder.customer?.city && (
                <p><strong>City / State:</strong> {selectedOrder.customer.city}, {selectedOrder.customer.state} – {selectedOrder.customer.pincode}</p>
              )}
              {selectedOrder.giftWrap && (
                <p className="text-[#D91680] font-bold">🎁 Gift Wrap Requested</p>
              )}
              {selectedOrder.customer?.note && (
                <p className="italic text-[#D91680]"><strong>Note:</strong> "{selectedOrder.customer.note}"</p>
              )}
              <p className="text-[#6A758E]"><strong>Placed on:</strong> {formatDate(selectedOrder.createdAt)}</p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#1A1F2C] uppercase tracking-wider text-xs">
                Items ({selectedOrder.items?.length || 0})
              </h4>
              {(selectedOrder.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-[#EEF3FA]/30 border border-[#B9C9E7]/40">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100'}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded-xl bg-white border border-[#B9C9E7]/40"
                    />
                    <div>
                      <p className="font-bold text-[#1A1F2C]">{item.name}</p>
                      <p className="text-[#6A758E]">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-[#1A1F2C]">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#EEF3FA] flex justify-between text-sm font-bold text-[#1A1F2C]">
              <span>Total Product Value</span>
              <span className="text-base text-[#D91680] font-black">{formatCurrency(selectedOrder.totalAmount)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleWhatsAppCustomer(selectedOrder)}
                className="flex-1 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Customer</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider cursor-pointer"
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
