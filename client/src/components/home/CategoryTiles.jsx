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

// Botanical Watermark for card corner
const CardOliveWatermark = ({ className = 'w-8 h-6' }) => (
  <svg viewBox="0 0 80 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 45 C35 38 55 25 75 8 C60 16 40 28 5 45 Z" opacity="0.4" />
    <path d="M72 10 C62 8 56 12 54 18 C62 14 69 13 72 10 Z" />
    <path d="M58 17 C48 15 42 20 40 25 C48 21 55 20 58 17 Z" />
    <path d="M42 25 C32 22 26 27 24 32 C32 28 39 28 42 25 Z" />
    <path d="M68 7 C62 2 55 4 52 10 C58 7 64 6 68 7 Z" />
    <path d="M54 13 C47 7 40 10 37 16 C44 13 50 12 54 13 Z" />
    <path d="M38 21 C31 15 24 18 21 24 C28 21 34 20 38 21 Z" />
  </svg>
);

const CATEGORY_CUSTOM_DATA = {
  canvas: {
    displayTitle: 'Durable Cotton Weave',
    tagline: 'Sturdy. Stylish. Everyday Ready.',
    btnColor: 'bg-[#163323] hover:bg-[#204430]',
    badgeIcon: 'leaf',
    fallbackImage: '/images/categories/travel-stationery.jpg',
  },
  jute: {
    displayTitle: 'Natural Golden Fiber',
    tagline: 'Earthy textures. Timeless charm.',
    btnColor: 'bg-[#A84E29] hover:bg-[#914120]',
    badgeIcon: 'heart',
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
                  fallbackImage: cat.image || '/images/categories/handpainted-jute.jpg',
                };

            const imageSrc = cat.image ? getAssetUrl(cat.image) : getAssetUrl(customData.fallbackImage);

            return (
              <div
                key={cat._id || cat.slug || idx}
                onClick={() => {
                  onNavigate('products', cat.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative w-full rounded-3xl overflow-hidden bg-[#FAF6EE] border border-[#E7DFD2] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group min-h-[190px] sm:min-h-[220px] md:min-h-[235px] flex items-center"
              >
                {/* Right Side Category Image with Smooth Gradient Mask into Parchment */}
                <div className="absolute right-0 top-0 bottom-0 w-[58%] sm:w-[50%] md:w-[48%] h-full overflow-hidden select-none">
                  <img
                    src={imageSrc}
                    alt={customData.displayTitle}
                    onError={(e) => {
                      if (customData.fallbackImage && e.currentTarget.src !== getAssetUrl(customData.fallbackImage)) {
                        e.currentTarget.src = getAssetUrl(customData.fallbackImage);
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle radial & linear blend so photo fades seamlessly into card background */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, #FAF6EE 0%, rgba(250,246,238,0.92) 22%, rgba(250,246,238,0.4) 55%, transparent 100%)',
                    }}
                  />
                </div>

                {/* Left Side Content Over Parchment */}
                <div className="relative z-10 w-[68%] sm:w-[58%] md:w-[54%] p-4 sm:p-6 md:p-8 flex flex-col justify-center items-start text-left">
                  
                  {/* Design Count Pill Badge */}
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#D5C7B2] shadow-2xs mb-2">
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
                  <p className="text-xs sm:text-sm text-[#55665B] mt-1 font-medium leading-snug">
                    {customData.tagline}
                  </p>

                  {/* Terracotta Divider Bar */}
                  <div className="w-7 h-[2px] bg-[#9C4D26] rounded-full my-2.5 sm:my-3" />

                  {/* Action Button */}
                  <button
                    type="button"
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-sm flex items-center space-x-1.5 transition-all group-hover:shadow-md active:scale-95 cursor-pointer ${customData.btnColor}`}
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>

                </div>

                {/* Decorative Botanical Watermark in Bottom-Left Corner */}
                <div className="absolute bottom-1.5 left-2 pointer-events-none text-[#8C9879] opacity-35">
                  <CardOliveWatermark className="w-8 h-6 sm:w-10 sm:h-7" />
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
