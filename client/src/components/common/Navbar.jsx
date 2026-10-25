import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { getAssetUrl } from '../../utils/assetHelper';

export const Navbar = ({ currentView, onNavigate }) => {
  const { totalItems, openCart } = useCart();
  const { openSearch, categories, settings } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNav = (view, param) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#E7DFD2] ${
          isScrolled
            ? 'shadow-[0_4px_20px_-4px_rgba(25,52,40,0.08)]'
            : 'shadow-[0_2px_10px_-2px_rgba(25,52,40,0.03)]'
        }`}
      >
        {/* Main Navigation Bar */}
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-[72px] md:h-20 w-full">
            {/* Left: Hamburger + Brand */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile Hamburger */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#193428] hover:bg-[#F0EBE1] transition-colors cursor-pointer shrink-0"
                aria-label="Toggle Navigation Drawer"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#A94F2B]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Brand Logo */}
              <div
                className="flex items-center cursor-pointer group py-1 min-w-0"
                onClick={() => handleNav('home')}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Brand Logo Stamp */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white shadow-xs border border-[#E7DFD2] group-hover:scale-105 group-hover:border-[#244537] transition-all shrink-0 p-0.5 flex items-center justify-center overflow-hidden">
                    <img
                      src={getAssetUrl('/images/logo.jpg')}
                      alt="Countryside Craft Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  {/* Name & Tag */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-brand-script text-lg sm:text-2xl lg:text-3xl tracking-wide text-[#193428] leading-none group-hover:text-[#244537] transition-colors truncate">
                      Countryside Craft
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase font-bold text-[#A94F2B] bg-[#F8F5EF] px-2 py-0.5 rounded-full border border-[#E7DFD2] mt-0.5 shadow-2xs group-hover:border-[#244537]/40 transition-all w-fit whitespace-nowrap">
                      <span>🌿</span>
                      <span>Handcrafted Botanical Goods</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 absolute left-1/2 -translate-x-1/2 z-10">
              {[
                { label: 'Home', view: 'home' },
                { label: 'Shop', view: 'products' },
                { label: 'Gallery', view: 'gallery' },
                { label: 'About', view: 'about' },
              ].map(({ label, view }) => {
                const isActive = currentView === view;
                return (
                  <button
                    key={view}
                    id={`nav-${view}-link`}
                    onClick={() => handleNav(view)}
                    className={`relative py-2.5 px-3.5 xl:px-4 text-sm xl:text-[15px] font-bold tracking-wide transition-all cursor-pointer group ${
                      isActive
                        ? 'text-[#244537] font-black'
                        : 'text-[#34443A] hover:text-[#244537]'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`absolute bottom-0 left-3.5 right-3.5 xl:left-4 xl:right-4 h-[2.5px] bg-gradient-to-r from-[#244537] to-[#C6A46A] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                id="search-trigger-btn"
                onClick={openSearch}
                className="flex items-center gap-2 text-xs font-medium text-[#6D756D] bg-[#F0EBE1]/70 hover:bg-[#F0EBE1] p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-[#E7DFD2] hover:border-[#244537]/40 shadow-2xs transition-all cursor-pointer min-w-10 min-h-10 justify-center"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4 text-[#6D756D]" />
                <span className="hidden xl:inline tracking-wide">Search designs...</span>
                <span className="hidden lg:inline xl:hidden">Search...</span>
                <kbd className="hidden lg:inline text-[10px] bg-white/90 text-[#6D756D] px-1.5 py-0.5 rounded-md border border-[#E7DFD2] shadow-2xs font-mono">
                  ⌘K
                </kbd>
              </button>

              <button
                id="nav-cart-btn"
                onClick={openCart}
                className="relative p-2.5 sm:p-3 rounded-full bg-[#244537] text-white hover:bg-[#193428] shadow-xs hover:shadow-md transition-all active:scale-98 flex items-center justify-center cursor-pointer border border-[#244537] min-w-10 min-h-10"
                aria-label="Open Shopping Bag Drawer"
              >
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
                {totalItems > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-1 -right-1 bg-[#C6A46A] text-[#193428] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-white"
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative w-[78%] max-w-[290px] h-full bg-[#193428] text-[#F8F5EF] shadow-2xl border-r border-[#244537] flex flex-col overflow-y-auto animate-slide-right">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#E7DFD2] p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={getAssetUrl('/images/logo.jpg')}
                    alt="Countryside Craft Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[#C6A46A] text-[11px] font-bold uppercase tracking-widest truncate">
                    <span>Countryside Craft</span>
                  </div>
                  <p className="text-[#F8F5EF]/70 text-[11px] mt-0.5 truncate">
                    By Rupinder • Handmade
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F8F5EF]/80 transition-colors cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 py-3 space-y-1 flex-1">
              {[
                { label: 'Home', emoji: '🏠', view: 'home' },
                { label: 'Shop All Products', emoji: '🛍️', view: 'products' },
                { label: 'Workshop Gallery', emoji: '🎨', view: 'gallery' },
                { label: 'Our Craft Story', emoji: '📖', view: 'about' },
              ].map(({ label, emoji, view }) => (
                <button
                  key={view}
                  id={`mobile-nav-${view}`}
                  onClick={() => handleNav(view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentView === view
                      ? 'bg-[#244537] text-white shadow-md border border-[#C6A46A]/40'
                      : 'text-[#F8F5EF]/80 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm leading-none">{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <span
                    className={`text-[10px] ${
                      currentView === view ? 'text-[#C6A46A]' : 'text-white/40'
                    }`}
                  >
                    →
                  </span>
                </button>
              ))}

              {/* Collections Quick Links */}
              {categories.length > 0 && (
                <div className="pt-3 mt-1 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#C6A46A] px-3.5 pb-2">
                    Collections
                  </p>
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleNav('products', cat.slug)}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#F8F5EF]/80 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A] shrink-0" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 pb-6 pt-3 border-t border-white/10 space-y-2 shrink-0">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#4ADE80] text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <p className="text-center text-[10px] text-[#F8F5EF]/50 pt-1">
                Handcrafted with ♥ in India
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};