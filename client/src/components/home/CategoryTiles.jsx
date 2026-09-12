import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryTiles = ({ onNavigate }) => {
  const { categories, products } = useStore();

  const collectionImages = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
  ];

  const getSubTag = (slug = '', name = '') => {
    const lower = (slug + ' ' + name).toLowerCase();
    if (lower.includes('stationery') || lower.includes('travel')) return 'Essentials & Kits';
    if (lower.includes('card') || lower.includes('shagun') || lower.includes('festive')) return 'Festive Gifting';
    if (lower.includes('hand-painted') || lower.includes('handpainted')) return 'Artisan Painted';
    if (lower.includes('bottle') || lower.includes('utility')) return 'Eco Utility';
    if (lower.includes('block') || lower.includes('dabu')) return 'Artisan Craft';
    if (lower.includes('botanical') || lower.includes('floral')) return 'Heritage Art';
    return 'Sustainable Goods';
  };

  return (
    <section className="py-8 sm:py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#EADDC6]/40">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#D91680] mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
              Shop by Craft &amp; Occasion
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-bold text-[#D91680] hover:text-[#BE0E6E] flex items-center space-x-1 transition-colors group cursor-pointer pb-0.5"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Snap Carousel on Mobile, 4-Column Grid on Desktop */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-3 sm:gap-6 pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => (p.category?.slug || p.category) === cat.slug).length;
            const subTag = getSubTag(cat.slug, cat.name);

            return (
              <div
                key={cat._id}
                onClick={() => {
                  onNavigate('products', cat.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="snap-start shrink-0 w-[148px] sm:w-auto rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col border border-[#F1E9DF] hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                {/* Card Image */}
                <div className="relative w-full h-[155px] sm:h-[220px] md:h-[260px] bg-[#FAF7F2] overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FDFBF7] via-[#F5ECE1] to-[#EBE0D3] flex flex-col items-center justify-center p-3 text-center border-b border-[#E8DDCE]">
                      <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#E5D7C7] flex items-center justify-center text-[#D91680] shadow-2xs mb-2 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="font-brand-script text-base sm:text-lg text-[#1A1F2C] leading-none">
                        Countryside Craft
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#8A7A6C] font-bold mt-1">
                        Artisan Collection
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-2xs">
                    <span className="text-[9px] uppercase tracking-wide text-[#1A1F2C] font-bold">
                      {count} {count === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#D91680] font-bold block">
                      {subTag}
                    </span>
                    <h3 className="text-[13px] sm:text-base font-semibold text-[#1A1F2C] mt-0.5 leading-tight group-hover:text-[#D91680] transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-[11px] sm:text-xs text-[#D91680] flex items-center gap-0.5 mt-2 font-semibold">
                    <span>Explore</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

