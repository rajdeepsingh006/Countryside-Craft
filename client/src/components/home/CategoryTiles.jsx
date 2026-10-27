import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getAssetUrl } from '../../utils/assetHelper';

const CATEGORY_THUMBNAILS = {
  'jute': '/images/categories/handpainted-jute.jpg',
  'canvas': '/images/categories/travel-stationery.jpg',
  'utility-bottle-bags': '/images/categories/utility-bottle-bags.jpg',
  'handpainted-jute': '/images/categories/handpainted-jute.jpg',
  'festive-gifting': '/images/categories/festive-gifting.jpg',
  'travel-stationery': '/images/categories/travel-stationery.jpg',
};

export const CategoryTiles = ({ onNavigate }) => {
  const { categories, products } = useStore();

  const getSubTag = (slug = '', name = '') => {
    const lower = (slug + ' ' + name).toLowerCase();
    if (lower.includes('jute')) return 'Natural Golden Fiber';
    if (lower.includes('canvas')) return 'Durable Cotton Weave';
    if (lower.includes('stationery') || lower.includes('travel')) return 'Essentials & Kits';
    if (lower.includes('card') || lower.includes('shagun') || lower.includes('festive')) return 'Festive Gifting';
    if (lower.includes('hand-painted') || lower.includes('handpainted')) return 'Artisan Painted';
    if (lower.includes('bottle') || lower.includes('utility')) return 'Eco Utility';
    if (lower.includes('block') || lower.includes('dabu')) return 'Artisan Craft';
    if (lower.includes('botanical') || lower.includes('floral')) return 'Heritage Art';
    return 'Sustainable Goods';
  };

  return (
    <section className="py-8 sm:py-16 bg-[#FDFBF7] texture-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#EADDC6]/40">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#1E3A8A] bg-[#EEF3FA] border border-[#B9C9E7] px-2.5 py-1 rounded-full mb-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-serif-display font-bold text-[#1A1F2C]">
              Shop by Craft &amp; Material
            </h2>
          </div>
        </div>

        {/* Full-width Responsive Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full ${
          categories.length > 2 ? 'lg:grid-cols-4' : ''
        }`}>
          {categories.map((cat, idx) => {
            const count = products.filter((p) => (p.category?.slug || p.category) === cat.slug).length;
            const subTag = getSubTag(cat.slug, cat.name);
            const fallbackThumbnail = CATEGORY_THUMBNAILS[cat.slug] || '';
            const rawImage = cat.image || fallbackThumbnail;
            const imageSrc = rawImage ? getAssetUrl(rawImage) : '';

            return (
              <div
                key={cat._id}
                onClick={() => {
                  onNavigate('products', cat.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col border border-[#F1E9DF] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Card Image */}
                <div className="relative w-full h-[155px] sm:h-[220px] md:h-[260px] bg-[#FAF7F2] overflow-hidden">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      onError={(e) => {
                        if (fallbackThumbnail && e.currentTarget.src !== getAssetUrl(fallbackThumbnail)) {
                          e.currentTarget.src = getAssetUrl(fallbackThumbnail);
                        }
                      }}
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
                    <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold block ${
                      idx % 2 === 0 ? 'text-[#2D4B7D]' : 'text-[#475708]'
                    }`}>
                      {subTag}
                    </span>
                    <h3 className="text-[13px] sm:text-base font-semibold text-[#1A1F2C] mt-0.5 leading-tight group-hover:text-[#D91680] transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-[#6A758E] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                        {cat.description}
                      </p>
                    )}
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

