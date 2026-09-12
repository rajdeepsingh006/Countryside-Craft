import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Star,
  Package,
  MessageCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatShortDate } from '../../utils/formatters';
import { generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { orders, products, reviews, settings } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeProducts = products.filter((p) => p.isActive);
  const approvedReviews = reviews.filter((r) => r.isApproved);
  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  // Mock revenue chart points
  const chartData = [
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 68000 },
    { month: 'Jun', revenue: 95000 },
    { month: 'Jul', revenue: 124000 },
    { month: 'Aug', revenue: 158000 },
    { month: 'Sep', revenue: totalRevenue > 0 ? totalRevenue : 185000 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8C7E6C]">
            <span className="font-semibold uppercase tracking-wider">Recorded Sales</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#241F18]">{formatCurrency(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+24.5% vs last month</span>
          </p>
        </div>

        {/* Metric 2: Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-2 cursor-pointer hover:border-[#8C5E3C] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#8C7E6C]">
            <span className="font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-lg bg-[#FAF6EE] text-[#8C5E3C]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#241F18]">{orders.length}</p>
          <p className="text-[11px] text-[#8C5E3C] font-semibold">
            {pendingOrders.length} pending WhatsApp confirmation
          </p>
        </div>

        {/* Metric 3: Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-2 cursor-pointer hover:border-[#8C5E3C] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#8C7E6C]">
            <span className="font-semibold uppercase tracking-wider">Live Catalog</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#241F18]">{activeProducts.length} Totes</p>
          <p className="text-[11px] text-[#7A6D5C]">
            {products.filter((p) => p.stock <= 5).length} low stock alerts
          </p>
        </div>

        {/* Metric 4: Customer Satisfaction */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-2 cursor-pointer hover:border-[#8C5E3C] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#8C7E6C]">
            <span className="font-semibold uppercase tracking-wider">Buyer Rating</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#241F18]">{avgRating}★ / 5.0</p>
          <p className="text-[11px] text-[#7A6D5C]">
            Based on {reviews.length} customer reviews
          </p>
        </div>

      </div>

      {/* Revenue Chart Section */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display font-bold text-base text-[#241F18]">
              Monthly Artisan Tote Revenue Trend
            </h3>
            <p className="text-xs text-[#7A6D5C]">
              Includes online storefront orders and custom bulk wedding hampers
            </p>
          </div>
          <span className="text-xs font-bold text-[#8C5E3C] bg-[#FAF6EE] px-3 py-1 rounded-lg">
            FY 2026-27
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8C5E3C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8C5E3C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#A39684" fontSize={11} />
              <YAxis stroke="#A39684" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']}
                contentStyle={{ backgroundColor: '#26221D', color: '#fff', borderRadius: '12px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8C5E3C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-display font-bold text-base text-[#241F18]">
              Recent Incoming Orders
            </h3>
            <p className="text-xs text-[#7A6D5C]">
              Instant WhatsApp status and customer contact shortcuts
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#8C5E3C] hover:underline"
          >
            View All ({orders.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-[#8C7E6C] font-semibold uppercase tracking-wider">
                <th className="pb-3">Order #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 font-mono font-bold text-[#8C5E3C]">
                    #{order.orderNumber}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-[#241F18] block">{order.customer.name}</span>
                    <span className="text-[#8C7E6C] text-[11px]">+91 {order.customer.phone}</span>
                  </td>
                  <td className="py-3 text-[#52483B]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-3 font-bold text-[#241F18]">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'confirmed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        const url = generateWhatsAppUrl(
                          order.customer.phone,
                          `Namaste ${order.customer.name}! This is VANA Artisan team regarding Order #${order.orderNumber}.`
                        );
                        window.open(url, '_blank');
                      }}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors inline-flex items-center space-x-1"
                      title="Chat with customer on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">Chat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
