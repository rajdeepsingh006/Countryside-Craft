import React from 'react';
import { Home, Grid, Image as ImageIcon, BookOpen } from 'lucide-react';

export const BottomTabBar = ({ currentView, onNavigate }) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => onNavigate('home'),
      isActive: currentView === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: Grid,
      action: () => onNavigate('products'),
      isActive: currentView === 'products' || currentView === 'product-detail',
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: ImageIcon,
      action: () => onNavigate('gallery'),
      isActive: currentView === 'gallery',
    },
    {
      id: 'about',
      label: 'About',
      icon: BookOpen,
      action: () => onNavigate('about'),
      isActive: currentView === 'about',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FFFDFB]/95 backdrop-blur-md border-t border-[#F0E4D8] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 h-15 max-w-md mx-auto items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={tab.action}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative select-none active:scale-95 ${
                tab.isActive
                  ? 'text-[#D91680] font-bold'
                  : tab.isHighlight
                  ? 'text-[#25D366] hover:text-[#1EB855]'
                  : 'text-[#6E645A] hover:text-[#1A1F2C]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    tab.isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    id="mobile-tab-cart-badge"
                    className="absolute -top-1.5 -right-2.5 bg-[#D91680] text-white text-[10px] font-black min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center border-2 border-[#FFFDFB] shadow-xs animate-scale-in"
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {tab.label}
              </span>
              {tab.isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#D91680]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
