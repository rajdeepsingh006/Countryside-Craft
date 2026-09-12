import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { totalItems, openCart } = useCart();
  const { openSearch, categories, settings } = useStore();
  const { isAuthenticated, admin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleNav = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8DFD0] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#4A453E] hover:bg-[#F2ECE1] transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              id="mobile-search-btn"
              onClick={openSearch}
              className="p-2 ml-1 rounded-lg text-[#4A453E] hover:bg-[#F2ECE1] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#3B362F] text-[#E8DCC4] flex items-center justify-center shadow-sm font-brand font-bold text-lg tracking-wider border border-[#544D43]">
                V
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-brand font-bold text-xl md:text-2xl tracking-[0.18em] text-[#24211D]">
                    VANA
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#EADECC] text-[#524433] tracking-widest hidden sm:inline-block">
                    Artisan
                  </span>
                </div>
                <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#7A7062] font-medium -mt-0.5">
                  Handcrafted Printed Totes
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              id="nav-home-link"
              onClick={() => handleNav('home')}
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                currentView === 'home'
                  ? 'text-[#8C5E3C] font-semibold'
                  : 'text-[#4F493F] hover:text-[#8C5E3C]'
              }`}
            >
              Home
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C5E3C] rounded-full" />
              )}
            </button>

            <button
              id="nav-products-link"
              onClick={() => handleNav('products')}
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                currentView === 'products'
                  ? 'text-[#8C5E3C] font-semibold'
                  : 'text-[#4F493F] hover:text-[#8C5E3C]'
              }`}
            >
              All Totes
              {currentView === 'products' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C5E3C] rounded-full" />
              )}
            </button>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                id="nav-categories-dropdown"
                onMouseEnter={() => setCategoriesOpen(true)}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-sm font-medium text-[#4F493F] hover:text-[#8C5E3C] py-1 flex items-center space-x-1"
              >
                <span>Collections</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className={`absolute left-0 top-full pt-2 w-72 transition-all duration-150 ${
                  categoriesOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
              >
                <div className="bg-[#FAF7F2] rounded-xl shadow-xl border border-[#E6DDCE] p-2 space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleNav('products', cat.slug)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-[#3E3931] hover:bg-[#EFE7D8] hover:text-[#8C5E3C] transition-colors flex items-center justify-between group/item"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-7 h-7 rounded-md object-cover border border-[#D5C9B5]"
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[11px] text-[#8C7E6C] group-hover/item:text-[#8C5E3C]">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              id="nav-gallery-link"
              onClick={() => handleNav('gallery')}
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                currentView === 'gallery'
                  ? 'text-[#8C5E3C] font-semibold'
                  : 'text-[#4F493F] hover:text-[#8C5E3C]'
              }`}
            >
              Workshop Gallery
              {currentView === 'gallery' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C5E3C] rounded-full" />
              )}
            </button>

            <button
              id="nav-about-link"
              onClick={() => handleNav('about')}
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                currentView === 'about'
                  ? 'text-[#8C5E3C] font-semibold'
                  : 'text-[#4F493F] hover:text-[#8C5E3C]'
              }`}
            >
              Our Craft Story
              {currentView === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C5E3C] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Action Icons & Portal Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Button */}
            <button
              id="desktop-search-btn"
              onClick={openSearch}
              className="hidden lg:flex items-center space-x-2 text-xs font-medium text-[#685F53] bg-[#EFE8DC] hover:bg-[#E5DC CD] px-3 py-1.5 rounded-full border border-[#DCD1BF] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search designs...</span>
              <kbd className="text-[10px] bg-[#FAF6EE] text-[#7A7165] px-1.5 py-0.5 rounded border border-[#D5CABB]">
                ⌘K
              </kbd>
            </button>

            {/* Admin Portal Quick Switch */}
            <button
              id="nav-admin-portal-btn"
              onClick={() => handleNav('admin-dashboard')}
              title={isAuthenticated ? `Logged in as ${admin?.name}` : 'Admin Management Panel'}
              className={`flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                isAuthenticated
                  ? 'bg-amber-900/10 text-amber-900 border-amber-800/30 hover:bg-amber-900/20'
                  : 'bg-[#EDE4D5] text-[#554C3F] border-[#D9CEBC] hover:bg-[#E2D6C4]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#8C5E3C]" />
              <span className="hidden sm:inline">
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}
              </span>
              {isAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              )}
            </button>

            {/* Shopping Cart Button with Animated Counter */}
            <button
              id="nav-cart-btn"
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-[#3B362F] text-[#F9F6F0] hover:bg-[#25221D] shadow-sm transition-transform active:scale-95 flex items-center justify-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#F2ECE1]" />
              {totalItems > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-[#B33E2B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F4EC] border-b border-[#E3D8C6] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              id="mobile-nav-home"
              onClick={() => handleNav('home')}
              className={`p-3 rounded-lg text-left text-sm font-medium border ${
                currentView === 'home'
                  ? 'bg-[#EADECC] text-[#332B21] border-[#C8B8A0]'
                  : 'bg-[#FAF6EE] text-[#4A4338] border-[#E5DAC8]'
              }`}
            >
              🏠 Home
            </button>
            <button
              id="mobile-nav-products"
              onClick={() => handleNav('products')}
              className={`p-3 rounded-lg text-left text-sm font-medium border ${
                currentView === 'products'
                  ? 'bg-[#EADECC] text-[#332B21] border-[#C8B8A0]'
                  : 'bg-[#FAF6EE] text-[#4A4338] border-[#E5DAC8]'
              }`}
            >
              👜 All Totes
            </button>
            <button
              id="mobile-nav-gallery"
              onClick={() => handleNav('gallery')}
              className={`p-3 rounded-lg text-left text-sm font-medium border ${
                currentView === 'gallery'
                  ? 'bg-[#EADECC] text-[#332B21] border-[#C8B8A0]'
                  : 'bg-[#FAF6EE] text-[#4A4338] border-[#E5DAC8]'
              }`}
            >
              🎨 Workshop Gallery
            </button>
            <button
              id="mobile-nav-about"
              onClick={() => handleNav('about')}
              className={`p-3 rounded-lg text-left text-sm font-medium border ${
                currentView === 'about'
                  ? 'bg-[#EADECC] text-[#332B21] border-[#C8B8A0]'
                  : 'bg-[#FAF6EE] text-[#4A4338] border-[#E5DAC8]'
              }`}
            >
              📖 Craft Story
            </button>
          </div>

          <div className="pt-2 border-t border-[#E3D8C6]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A7D6B] mb-2 px-1">
              Shop by Category
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleNav('products', cat.slug)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#3A342B] hover:bg-[#EBE2D2] flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-[#998973]">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3D8C6] flex items-center justify-between text-xs text-[#6B6153]">
            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp: +{settings.whatsappNumber}</span>
            </span>
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="text-[#8C5E3C] font-semibold underline underline-offset-2"
            >
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
