import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Gift, Phone, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const Navbar = ({ currentView, onNavigate }) => {
  const { totalItems, openCart } = useCart();
  const { openSearch, categories, settings } = useStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);

  // Track scroll position for frosted glass backdrop
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
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Announcements list with 2 consistent accent tones (Pink & Gold)
  const announcements = [
    {
      id: 'festive',
      icon: Gift,
      tag: 'FESTIVE OFFER',
      text: settings.announcementBarText || 'Free Handmade Zipper Pouch on orders over ₹1,499 | Pan-India 48hr Dispatch',
      mobileText: '✦ FESTIVE SALE: Free Handmade Pouch on orders ₹1,499+',
      tagColor: 'text-[#E5C378] border-[#E5C378]/30 bg-[#E5C378]/10',
    },
    {
      id: 'craft',
      icon: Sparkles,
      tag: 'HERITAGE CRAFT',
      text: 'Artisanal Small Batches • Master Carved Teakwood Botanical Prints',
      mobileText: '✦ HERITAGE CRAFT: 100% Handcrafted Artisanal Batches',
      tagColor: 'text-[#F3B7D7] border-[#F3B7D7]/30 bg-[#F3B7D7]/10',
    },
    {
      id: 'sustainable',
      icon: ShieldCheck,
      tag: '100% ORGANIC',
      text: 'Heavyweight 450 GSM Organic Cotton Canvas • Zero Synthetic Plastics',
      mobileText: '✦ 100% ORGANIC: Pure Cotton Canvas • Zero Plastic Packaging',
      tagColor: 'text-[#E5C378] border-[#E5C378]/30 bg-[#E5C378]/10',
    },
  ];

  // Auto-rotate announcement every 4.5 seconds
  useEffect(() => {
    if (!settings.announcementEnabled) return;
    const timer = setInterval(() => {
      setActiveAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [settings.announcementEnabled, announcements.length]);

  const handleNav = (view, param) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  const currentAnnouncement = announcements[activeAnnouncementIdx];
  const AnnouncementIcon = currentAnnouncement.icon;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#FFFDFB] border-b border-[#F0E4D8] ${
          isScrolled
            ? 'shadow-[0_4px_20px_-4px_rgba(217,22,128,0.08)] backdrop-blur-md bg-[#FFFDFB]/95'
            : 'shadow-[0_2px_10px_-2px_rgba(26,31,44,0.04)]'
        }`}
      >
        {/* 1. Rotating Announcement Bar */}
        {settings.announcementEnabled && (
          <div className="bg-gradient-to-r from-[#220718] via-[#2F0B22] to-[#220718] text-[#FBF5F8] border-b border-[#EFC0DA]/15 px-3 sm:px-4 py-1.5 sm:py-2 text-xs relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveAnnouncementIdx((prev) => (prev > 0 ? prev - 1 : announcements.length - 1))}
                className="text-white/50 hover:text-white transition-colors p-1 cursor-pointer shrink-0"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex items-center justify-center space-x-1.5 sm:space-x-3 text-center min-w-0 px-1">
                <span className={`hidden md:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentAnnouncement.tagColor} shrink-0`}>
                  <AnnouncementIcon className="w-3 h-3" />
                  <span>{currentAnnouncement.tag}</span>
                </span>
                <span className="font-sans font-medium text-[11px] sm:text-xs tracking-tight sm:tracking-wide text-white/95 text-center leading-tight">
                  <span className="sm:hidden">{currentAnnouncement.mobileText || currentAnnouncement.text}</span>
                  <span className="hidden sm:inline">{currentAnnouncement.text}</span>
                </span>
              </div>

              <button
                onClick={() => setActiveAnnouncementIdx((prev) => (prev + 1) % announcements.length)}
                className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Main Navigation Bar */}
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-[72px] md:h-20 w-full">

            {/* Left: Hamburger + Brand */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile Hamburger */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#1A1F2C] hover:bg-[#F2ECE3] transition-colors cursor-pointer shrink-0"
                aria-label="Toggle Navigation Drawer"
              >
                {mobileMenuOpen
                  ? <X className="w-5 h-5 text-[#D91680]" />
                  : <Menu className="w-5 h-5" />
                }
              </button>

              {/* Brand Logo */}
              <div
                className="flex items-center cursor-pointer group py-1 min-w-0"
                onClick={() => handleNav('home')}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Monogram */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#D91680] to-[#9C0A58] text-white flex items-center justify-center shadow-md font-brand-script font-bold text-base sm:text-lg border border-[#EFC0DA]/50 group-hover:scale-105 transition-transform shrink-0">
                    CC
                  </div>
                  {/* Name */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-brand-script text-lg sm:text-2xl lg:text-3xl tracking-wide text-[#1A1F2C] leading-none group-hover:text-[#D91680] transition-colors truncate">
                      Countryside Craft
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[9px] tracking-[0.2em] uppercase font-black text-[#86124F] bg-[#FDF1F7] px-2 py-0.5 rounded-full border border-[#EFC0DA] mt-0.5 shadow-2xs group-hover:border-[#D91680] transition-all w-fit whitespace-nowrap">
                      <span>🌿</span>
                      <span>Handcrafted Botanical Totes</span>
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
                      isActive ? 'text-[#D91680] font-black' : 'text-[#1A1F2C] hover:text-[#D91680]'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`absolute bottom-0 left-3.5 right-3.5 xl:left-4 xl:right-4 h-[2.5px] bg-gradient-to-r from-[#D91680] to-[#E5C378] rounded-full transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                  </button>
                );
              })}
            </nav>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                id="search-trigger-btn"
                onClick={openSearch}
                className="flex items-center gap-2 text-xs font-medium text-[#5E6B87] bg-[#F5F2ED]/70 hover:bg-[#EFEAE2] p-2.5 sm:px-3.5 sm:py-2 rounded-full border border-[#E5DDD2] hover:border-[#D91680]/40 shadow-2xs transition-all cursor-pointer min-w-10 min-h-10 justify-center"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4 text-[#8896B3]" />
                <span className="hidden xl:inline tracking-wide">Search designs...</span>
                <span className="hidden lg:inline xl:hidden">Search...</span>
                <kbd className="hidden lg:inline text-[10px] bg-white/80 text-[#6B758E] px-1.5 py-0.5 rounded-md border border-[#E5DDD2] shadow-2xs font-mono">⌘K</kbd>
              </button>

              <button
                id="nav-cart-btn"
                onClick={openCart}
                className="relative p-2.5 sm:p-3 rounded-full bg-[#D91680] text-white hover:bg-[#BE0E6E] shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer border border-[#EFC0DA] min-w-10 min-h-10"
                aria-label="Open Shopping Bag Drawer"
              >
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
                {totalItems > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-1 -right-1 bg-[#E5C378] text-[#342705] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-white"
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Mobile Drawer — Full Fixed Overlay (z-[60] above everything) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          {/* Dark Backdrop — clicking closes the drawer */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="relative w-[78%] max-w-[290px] h-full bg-[#161C2A] shadow-2xl border-r border-[#B9C9E7]/15 flex flex-col overflow-y-auto animate-slide-right">

            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-1.5 text-[#DBE586] text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  <span>Countryside Craft</span>
                </div>
                <p className="text-[#A9B8D4] text-[11px] mt-0.5">Browse our handmade collection</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A9B8D4] transition-colors cursor-pointer"
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
                      ? 'bg-[#D91680] text-white shadow-md border border-[#EFC0DA]/40'
                      : 'text-[#B9C9E7] hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm leading-none">{emoji}</span>
                    <span>{label}</span>
                  </div>
                  <span className={`text-[10px] ${currentView === view ? 'text-white/60' : 'text-[#3D4F6A]'}`}>→</span>
                </button>
              ))}

              {/* Category Quick Links */}
              {categories.length > 0 && (
                <div className="pt-3 mt-1 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#3D4F6A] px-3.5 pb-2">Collections</p>
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleNav('products', cat.slug)}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#B9C9E7] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DBE586] shrink-0" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>

            {/* Bottom Footer */}
            <div className="px-3 pb-6 pt-3 border-t border-white/10 space-y-2 shrink-0">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#4ADE80] text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <p className="text-center text-[10px] text-[#3D4F6A] pt-1">Handcrafted with ♥ in India</p>
            </div>

          </aside>
        </div>
      )}
    </>
  );
};