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
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E7DFD2] shadow-[0_-4px_20px_rgba(25,52,40,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 h-15 max-w-md mx-auto items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={tab.action}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative select-none active:scale-95 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 shadow-none focus:shadow-none [-webkit-tap-highlight-color:transparent] ${
                tab.isActive
                  ? 'text-[#244537] font-bold'
                  : 'text-[#6D756D] hover:text-[#34443A]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    tab.isActive ? 'scale-110 stroke-[2.5] text-[#244537]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  tab.isActive ? 'font-bold text-[#244537]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {tab.isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C6A46A]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
