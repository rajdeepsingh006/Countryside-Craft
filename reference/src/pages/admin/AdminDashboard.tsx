import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { AdminOverview } from '../../components/admin/AdminOverview';
import { AdminOrders } from '../../components/admin/AdminOrders';
import { AdminProducts } from '../../components/admin/AdminProducts';
import { AdminReviews } from '../../components/admin/AdminReviews';
import { AdminGallery } from '../../components/admin/AdminGallery';
import { AdminSettings } from '../../components/admin/AdminSettings';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const { admin, logout } = useAuth();
  const { orders, reviews, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'reviews' | 'gallery' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;

  const handleLogout = () => {
    logout();
    showToast('Signed out of admin dashboard', 'info');
    onNavigateHome();
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & WhatsApp', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'products', label: 'Tote Bags Catalog', icon: Package },
    { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: pendingReviewsCount },
    { id: 'gallery', label: 'Workshops & Events', icon: ImageIcon },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#241F1A] text-white p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="font-serif-display font-bold text-sm tracking-wider">VANA ADMIN</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold"
          >
            Storefront
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#241F1A] text-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="pb-6 border-b border-white/10">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Artisan Portal</span>
            </div>
            <h2 className="font-serif-display font-bold text-xl text-white mt-1">
              VANA Artisan
            </h2>
            <p className="text-[11px] text-[#A39684] mt-0.5">
              Signed in as <strong>{admin?.name || 'Administrator'}</strong>
            </p>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#8C5E3C] text-white shadow-md'
                      : 'text-[#C5BAA8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-[#8C5E3C]' : 'bg-amber-400 text-[#241F1A]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#E3D9CD] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === 'overview' && <AdminOverview onNavigateTab={(tab) => setActiveTab(tab as any)} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'gallery' && <AdminGallery />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

    </div>
  );
};
