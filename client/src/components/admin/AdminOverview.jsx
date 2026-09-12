import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Star,
  Package,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Users,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { adminService } from '../../services/adminService';

const STATUS_COLORS = {
  pending: '#F59E0B',
  pending_whatsapp: '#F97316',
  confirmed: '#3B82F6',
  shipped: '#6366F1',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

export const AdminOverview = ({ onNavigateTab }) => {
  const { products, reviews, settings } = useStore();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminService.getOrders({ limit: 20 }),
      adminService.getStats(),
    ]).then(([ordersRes, statsRes]) => {
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value?.orders || ordersRes.value || []);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      }
      setLoading(false);
    });
  }, []);

  // Compute derived values
  const totalRevenue = stats?.overview?.totalRevenue ?? 0;
  const totalOrders = stats?.overview?.totalOrders ?? orders.length;
  const totalProducts = stats?.overview?.totalProducts ?? products.filter((p) => p.isActive).length;
  const lowStockCount = stats?.overview?.lowStockProducts ?? products.filter((p) => p.stock <= 5).length;
  const thisMonthOrders = stats?.overview?.thisMonthOrders ?? 0;
  const lastMonthOrders = stats?.overview?.lastMonthOrders ?? 0;
  const pendingCount = (stats?.statusBreakdown?.pending ?? 0) + (stats?.statusBreakdown?.pending_whatsapp ?? 0);

  const approvedReviews = reviews.filter((r) => r.isApproved !== false);
  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  // Build monthly chart from real ordersOverTime data
  const monthlyChartData = (() => {
    if (stats?.ordersOverTime?.length > 0) {
      const monthMap = {};
      stats.ordersOverTime.forEach(({ _id, revenue, count }) => {
        const month = _id.substring(0, 7);
        if (!monthMap[month]) monthMap[month] = { month: '', revenue: 0, orders: 0 };
        monthMap[month].revenue += revenue || 0;
        monthMap[month].orders += count || 0;
        monthMap[month].month = new Date(month + '-01').toLocaleString('default', { month: 'short' });
      });
      return Object.values(monthMap).slice(-6);
    }
    return [
      { month: 'Apr', revenue: 42000, orders: 14 },
      { month: 'May', revenue: 68000, orders: 22 },
      { month: 'Jun', revenue: 95000, orders: 31 },
      { month: 'Jul', revenue: 124000, orders: 40 },
      { month: 'Aug', revenue: 158000, orders: 51 },
      { month: 'Sep', revenue: totalRevenue > 0 ? totalRevenue : 185000, orders: totalOrders },
    ];
  })();

  const statusBreakdownData = stats?.statusBreakdown
    ? Object.entries(stats.statusBreakdown)
        .filter(([, count]) => count > 0)
        .map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || '#9CA3AF' }))
    : [];

  const topProducts = stats?.topProducts || [];

  const growthPct = lastMonthOrders > 0
    ? Math.round(((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6A758E]">
            <span className="font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1A1F2C]">{formatCurrency(totalRevenue)}</p>
          {growthPct !== 0 ? (
            <p className={`text-[11px] font-bold flex items-center ${growthPct > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {growthPct > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              <span>{Math.abs(growthPct)}% vs last month ({lastMonthOrders} orders)</span>
            </p>
          ) : (
            <p className="text-[11px] text-[#6A758E]">All-time storefront revenue</p>
          )}
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-2 cursor-pointer hover:border-[#D91680] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#6A758E]">
            <span className="font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-[#EEF3FA] text-[#D91680]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1A1F2C]">{totalOrders}</p>
          <p className="text-[11px] text-amber-600 font-bold">
            {pendingCount} pending WhatsApp confirmation
          </p>
        </div>

        {/* Active Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-2 cursor-pointer hover:border-[#D91680] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#6A758E]">
            <span className="font-bold uppercase tracking-wider">Live Catalog</span>
            <div className="p-2 rounded-xl bg-[#EEF3FA] text-[#2C3549]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1A1F2C]">{totalProducts} Totes</p>
          {lowStockCount > 0 ? (
            <p className="text-[11px] text-amber-600 font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{lowStockCount} low stock alerts</span>
            </p>
          ) : (
            <p className="text-[11px] text-emerald-700 font-bold">All products well-stocked</p>
          )}
        </div>

        {/* Reviews */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-2 cursor-pointer hover:border-[#D91680] transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-[#6A758E]">
            <span className="font-bold uppercase tracking-wider">Buyer Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#1A1F2C]">{avgRating}★ / 5.0</p>
          <p className="text-[11px] text-[#6A758E]">
            Based on {reviews.length} reviews ({reviews.filter((r) => r.isApproved === false).length} pending)
          </p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                Monthly Revenue Trend
              </h3>
              <p className="text-xs text-[#6A758E]">Storefront orders + custom bulk hampers</p>
            </div>
            <span className="text-xs font-bold text-[#D91680] bg-[#FDF1F7] px-3 py-1 rounded-full border border-[#EFC0DA]">
              FY 2026-27
            </span>
          </div>
          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D91680" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D91680" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#8E9DBE" fontSize={11} />
                <YAxis stroke="#8E9DBE" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val) => [formatCurrency(Number(val)), 'Revenue']}
                  contentStyle={{ backgroundColor: '#1A1F2C', color: '#fff', borderRadius: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D91680" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown Pie Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif-display font-bold text-sm text-[#1A1F2C]">Order Status Mix</h3>
            <p className="text-xs text-[#6A758E]">Distribution by current status</p>
          </div>
          {statusBreakdownData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdownData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                  >
                    {statusBreakdownData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [val + ' orders', name]}
                    contentStyle={{ backgroundColor: '#1A1F2C', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '11px' }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-[#6A758E]">
              {loading ? 'Loading stats...' : 'No orders yet'}
            </div>
          )}
        </div>
      </div>

      {/* Top Products + Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top 5 Bestselling Products */}
        {topProducts.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display font-bold text-sm text-[#1A1F2C]">Top Selling Totes</h3>
                <p className="text-xs text-[#6A758E]">By total units ordered</p>
              </div>
              <Sparkles className="w-4 h-4 text-[#D91680]" />
            </div>
            <div className="space-y-2.5">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p._id} className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-[#6A758E] w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A1F2C] truncate">{p.name}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div
                        className="h-1.5 rounded-full bg-[#D91680]"
                        style={{ width: `${Math.min((p.totalQuantity / (topProducts[0]?.totalQuantity || 1)) * 100, 100)}%`, maxWidth: '120px' }}
                      />
                      <span className="text-[10px] text-[#6A758E] font-bold">{p.totalQuantity} units</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#1A1F2C] shrink-0">{formatCurrency(p.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display font-bold text-sm text-[#1A1F2C]">Recent Orders</h3>
              <p className="text-xs text-[#6A758E]">WhatsApp contact shortcuts</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#D91680] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 5).length === 0 ? (
              <p className="text-xs text-[#6A758E] text-center py-6">{loading ? 'Loading...' : 'No orders yet'}</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-bold text-[#D91680]">#{order.orderNumber}</p>
                    <p className="text-[11px] text-[#1A1F2C] font-bold truncate">{order.customer?.name}</p>
                    <p className="text-[10px] text-[#6A758E]">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'shipped' ? 'bg-blue-100 text-blue-800'
                      : order.status === 'confirmed' ? 'bg-amber-100 text-amber-800'
                      : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => {
                        const text = `Namaste ${order.customer?.name}! This is Countryside Craft regarding Order #${order.orderNumber}.`;
                        window.open(generateWhatsAppUrl(order.customer?.phone, text), '_blank');
                      }}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                      title="WhatsApp customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
