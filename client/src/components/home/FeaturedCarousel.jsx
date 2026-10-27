import React, { useState } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedCarousel = ({ onNavigate }) => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('bestseller');

  const filtered = products.filter((p) => {
    if (activeTab === 'bestseller') return p.isBestseller || (p.ratingAverage >= 4.9);
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'festive') return (p.category?.slug || p.category || '').includes('festive');
    return true;
  });

  const getTabCount = (tabId) => {
    if (tabId === 'bestseller') return products.filter((p) => p.isBestseller || (p.ratingAverage >= 4.9)).length;
    if (tabId === 'new') return products.filter((p) => p.isNewArrival).length;
    if (tabId === 'festive') return products.filter((p) => (p.category?.slug || p.category || '').includes('festive')).length;
    return products.length;
  };

  const tabs = [
    { id: 'bestseller', label: '⭐ Top Selling' },
    { id: 'new', label: '📦 New Arrivals' },
    { id: 'festive', label: '🎁 Festive & Gift' },
    { id: 'all', label: 'All Items' },
  ];

  return (
    <section className="py-8 sm:py-16 bg-[#FDFBF7] border-y border-[#EADDC6]/70 texture-canvas">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3 w-full md:w-auto">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#A94F2B] bg-[#FDF4EE] border border-[#F0D5C3] px-2.5 sm:px-3 py-1 rounded-full mb-1.5 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-[#A94F2B]" />
                <span>Artisan Highlights</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-serif-display font-bold text-[#163323] leading-tight">
                Featured Handcrafted Pieces
              </h2>
            </div>

            {/* Handwritten 'Made with Love ♡' callout matching user reference */}
            <div className="shrink-0 -rotate-6 select-none text-right pr-1 sm:pr-3">
              <span className="block font-handwriting text-xl sm:text-2xl md:text-3xl text-[#244537] font-bold leading-none tracking-wide">
                Made with
              </span>
              <span className="inline-flex items-center gap-1 font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#244537] font-bold leading-none underline decoration-[#A94F2B]/50 decoration-wavy underline-offset-4">
                Love <span className="text-base sm:text-xl text-[#A94F2B]">♡</span>
              </span>
            </div>
          </div>

          {/* Interactive Filter Pills matching reference mockup */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <span className="text-[11px] font-bold text-[#8A7E72] uppercase tracking-wider hidden sm:inline mr-1 shrink-0">
              Filter by:
            </span>
            {tabs.map((t) => {
              const isActive = activeTab === t.id;
              const count = getTabCount(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  aria-pressed={isActive}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 border active:scale-98 ${
                    isActive
                      ? 'bg-[#163323] text-white border-[#163323] shadow-md'
                      : 'bg-white text-[#4A443C] hover:bg-[#F8F5EF] border-[#E0D7C9] hover:border-[#163323]/30 hover:text-[#163323]'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C6A46A]" />}
                  <span>{t.label}</span>
                  <span
                    className={`text-[9.5px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#EFE8DC] text-[#6A5E54]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Product Grid on Mobile, 3/4-Column on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#163323] hover:bg-[#204430] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-98 cursor-pointer border border-[#163323]"
          >
            <span>Explore All {products.length} Handcrafted Pieces</span>
            <ArrowRight className="w-4 h-4 text-[#C6A46A]" />
          </button>
        </div>
      </div>
    </section>
  );
};

