import React from 'react';
import { ArrowRight, Leaf, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getAssetUrl } from '../../utils/assetHelper';

// Botanical Olive Sprig for section header
const HeaderOliveSprig = ({ className = 'w-10 h-8' }) => (
  <svg viewBox="0 0 80 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M75 42 C45 32 25 22 5 10 C18 18 38 28 75 42 Z" opacity="0.35" />
    <path d="M8 12 C18 10 24 14 26 20 C18 16 11 15 8 12 Z" />
    <path d="M22 19 C32 17 38 22 40 27 C32 23 25 22 22 19 Z" />
    <path d="M38 27 C48 24 54 29 56 34 C48 30 41 30 38 27 Z" />
    <path d="M12 9 C18 4 25 6 28 12 C22 9 16 8 12 9 Z" />
    <path d="M26 15 C33 9 40 12 43 18 C36 15 30 14 26 15 Z" />
    <path d="M42 23 C49 17 56 20 59 26 C52 23 46 22 42 23 Z" />
  </svg>
);

const CATEGORY_CUSTOM_DATA = {
  canvas: {
    displayTitle: 'Durable Cotton Weave',
    tagline: 'Sturdy. Stylish. Everyday Ready.',
    btnColor: 'bg-[#163323] hover:bg-[#204430]',
    badgeIcon: 'leaf',
    bgImage: '/images/categories/category-canvas-wide.png',
    fallbackImage: '/images/categories/travel-stationery.jpg',
  },
  jute: {
    displayTitle: 'Natural Golden Fiber',
    tagline: 'Earthy textures. Timeless charm.',
    btnColor: 'bg-[#A84E29] hover:bg-[#914120]',
    badgeIcon: 'heart',
    bgImage: '/images/categories/category-jute-wide.png',
    fallbackImage: '/images/categories/handpainted-jute.jpg',
  },
};

export const CategoryTiles = ({ onNavigate }) => {
  const { categories, products } = useStore();

  // Sort canvas first and jute second to match user reference mockup order
  const sortedCategories = [...categories].sort((a, b) => {
    const slugA = (a.slug || a.name || '').toLowerCase();
    const slugB = (b.slug || b.name || '').toLowerCase();
    if (slugA.includes('canvas')) return -1;
    if (slugB.includes('canvas')) return 1;
    if (slugA.includes('jute')) return -1;
    if (slugB.includes('jute')) return 1;
    return 0;
  });

  return (
    <section className="py-8 sm:py-16 bg-[#FAF7F0] texture-canvas border-b border-[#EADDC6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Matching Reference Mockup */}
        <div className="flex items-center justify-between mb-5 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-bold text-[#163323] leading-tight">
              Shop by Craft &amp; Material
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6151] font-sans mt-0.5 sm:mt-1">
              Thoughtfully curated, naturally inspired.
            </p>
          </div>

          {/* Decorative Botanical Olive Sprig in Header */}
          <div className="text-[#8C9879] opacity-80 shrink-0 ml-3">
            <HeaderOliveSprig className="w-10 h-7 sm:w-12 sm:h-9" />
          </div>
        </div>

        {/* Stacked Full-Width Horizontal Category Cards */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {sortedCategories.map((cat, idx) => {
            const count = products.filter(
              (p) => (p.category?.slug || p.category) === cat.slug || p.categoryObj?._id === cat._id
            ).length;

            const slug = (cat.slug || '').toLowerCase();
            const isCanvas = slug.includes('canvas');
            const isJute = slug.includes('jute');

            const customData = isCanvas
              ? CATEGORY_CUSTOM_DATA.canvas
              : isJute
              ? CATEGORY_CUSTOM_DATA.jute
              : {
                  displayTitle: cat.name,
                  tagline: cat.description || 'Thoughtfully crafted artisan goods.',
                  btnColor: idx % 2 === 0 ? 'bg-[#163323] hover:bg-[#204430]' : 'bg-[#A84E29] hover:bg-[#914120]',
                  badgeIcon: idx % 2 === 0 ? 'leaf' : 'heart',
                  bgImage: cat.image || '/images/categories/handpainted-jute.jpg',
                  fallbackImage: cat.image || '/images/categories/handpainted-jute.jpg',
                };

            const imageSrc = getAssetUrl(customData.bgImage || cat.image || customData.fallbackImage);

            return (
              <div
                key={cat._id || cat.slug || idx}
                onClick={() => {
                  onNavigate('products', cat.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group min-h-[195px] sm:min-h-[225px] md:min-h-[245px] flex items-center border border-[#E7DFD2]/80 bg-[#F5EFE4]"
              >
                {/* Full Panoramic Background Image covering the entire element */}
                <img
                  src={imageSrc}
                  alt={customData.displayTitle}
                  onError={(e) => {
                    if (customData.fallbackImage && e.currentTarget.src !== getAssetUrl(customData.fallbackImage)) {
                      e.currentTarget.src = getAssetUrl(customData.fallbackImage);
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover object-right sm:object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle soft natural gradient wash on the left to ensure 100% text contrast without obscuring background */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(250,246,238,0.76) 0%, rgba(250,246,238,0.52) 42%, rgba(250,246,238,0.15) 68%, transparent 90%)',
                  }}
                />

                {/* Left Side Content Layered Over the Photographic Background */}
                <div className="relative z-10 w-[72%] sm:w-[58%] md:w-[52%] p-4 sm:p-6 md:p-8 flex flex-col justify-center items-start text-left">
                  
                  {/* Design Count Pill Badge */}
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#D5C7B2] shadow-2xs mb-2">
                    {customData.badgeIcon === 'heart' ? (
                      <Heart className="w-3 h-3 text-[#A84E29] fill-[#A84E29]/20" aria-hidden="true" />
                    ) : (
                      <Leaf className="w-3 h-3 text-[#163323]" aria-hidden="true" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#163323]">
                      {count} {count === 1 ? 'DESIGN' : 'DESIGNS'}
                    </span>
                  </div>

                  {/* Serif Category Title */}
                  <h3 className="font-serif-display font-bold text-xl sm:text-2xl md:text-[28px] text-[#163323] leading-tight group-hover:text-[#8F3D1F] transition-colors">
                    {customData.displayTitle}
                  </h3>

                  {/* Subtitle / Tagline */}
                  <p className="text-xs sm:text-sm text-[#4E6151] mt-1 font-medium leading-snug">
                    {customData.tagline}
                  </p>

                  {/* Terracotta Divider Bar */}
                  <div className="w-7 h-[2.5px] bg-[#9C4D26] rounded-full my-2.5 sm:my-3" />

                  {/* Action Button */}
                  <button
                    type="button"
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-sm flex items-center space-x-1.5 transition-all group-hover:shadow-md active:scale-95 cursor-pointer ${customData.btnColor}`}
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
