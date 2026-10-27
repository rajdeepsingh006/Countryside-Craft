import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getAssetUrl } from '../../utils/assetHelper';

const CRAFT_FEATURES = [
  {
    id: 'craft-handpainted',
    name: 'Hand-Painted Jute Bags',
    subTag: 'Artisan Painted',
    badge: 'Artisan',
    description: 'Master-crafted natural jute bags adorned with hand-painted folk motifs & ring handles',
    image: '/images/categories/handpainted-jute.jpg',
    target: 'handprinted',
    filterFn: (p) =>
      p.tags?.some((t) => ['handprinted', 'artisan', 'phulkari', 'custom-printed'].includes(t)) ||
      (p.name || '').toLowerCase().includes('handprinted') ||
      (p.name || '').toLowerCase().includes('custom'),
  },
  {
    id: 'craft-utility',
    name: 'Jute Utility & Bottle Bags',
    subTag: 'Eco Utility & Handwork',
    badge: 'Handwork',
    description: 'Eco-friendly carriers designed for water bottles, thermoses, and daily utility',
    image: '/images/categories/utility-bottle-bags.jpg',
    target: 'bottle-bag',
    filterFn: (p) =>
      p.tags?.some((t) => ['bottle-bag', 'utility', 'cloth-handle', 'ring-handle'].includes(t)) ||
      (p.name || '').toLowerCase().includes('bottle'),
  },
  {
    id: 'craft-festive',
    name: 'Festive Cards & Shagun',
    subTag: 'Festive Gifting',
    badge: 'Heritage',
    description: 'Artisanal Shagun envelopes, traditional blessing cards, and celebratory gifting',
    image: '/images/categories/festive-gifting.jpg',
    target: 'shagun',
    filterFn: (p) =>
      p.tags?.some((t) => ['shagun', 'envelope', 'festive', 'wedding', 'return-gifts'].includes(t)) ||
      (p.name || '').toLowerCase().includes('shagun'),
  },
  {
    id: 'craft-stationery',
    name: 'Travel & Stationery Kits',
    subTag: 'Essentials & Kits',
    badge: 'Handcrafted',
    description: 'Handcrafted multi-utility pouches, stationery kits, and compact organizers',
    image: '/images/categories/travel-stationery.jpg',
    target: 'pouch',
    filterFn: (p) =>
      p.tags?.some((t) => ['pouch', 'kit', 'stationery', 'tea-coaster', 'coasters'].includes(t)) ||
      (p.name || '').toLowerCase().includes('pouch') ||
      (p.name || '').toLowerCase().includes('kit'),
  },
];

export const CraftFeaturesTiles = ({ onNavigate }) => {
  const { products } = useStore();

  return (
    <section className="py-8 sm:py-14 bg-[#FDFBF7] texture-canvas border-b border-[#EADDC6]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-[#EADDC6]/40">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#A94F2B] bg-[#FDF4EE] border border-[#F0D5C3] px-2.5 py-1 rounded-full mb-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#A94F2B]" />
              <span>Artisan &amp; Handwork Craft</span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif-display font-bold text-[#163323]">
                Shop by Craft &amp; Occasion
              </h2>
              <span className="hidden sm:inline-flex font-handwriting text-2xl text-[#244537] font-bold -rotate-3 select-none ml-2">
                ~ stitched with love 𖤣𖥧
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-bold text-[#A94F2B] hover:text-[#8E3F1F] flex items-center space-x-1 transition-colors group cursor-pointer pb-0.5"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4-Card Grid on Desktop, Smooth Snap Carousel on Mobile */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-3 sm:gap-6 pb-2 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 md:grid-cols-2 lg:grid-cols-4">
          {CRAFT_FEATURES.map((item, idx) => {
            const count = products.filter(item.filterFn).length || 3;
            const imageSrc = getAssetUrl(item.image);

            return (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate('products', item.target);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="snap-start shrink-0 w-[160px] sm:w-auto rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col border border-[#F1E9DF] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Card Image */}
                <div className="relative w-full h-[155px] sm:h-[220px] md:h-[250px] bg-[#FAF7F2] overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm shadow-2xs">
                    <span className="text-[9px] uppercase tracking-wide text-[#1A1F2C] font-bold">
                      {count} {count === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1A1F2C]/85 backdrop-blur-sm shadow-2xs">
                    <span className="text-[9px] uppercase tracking-wider text-[#DBE586] font-bold">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span
                      className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-bold block ${
                        idx % 2 === 0 ? 'text-[#2D4B7D]' : 'text-[#475708]'
                      }`}
                    >
                      {item.subTag}
                    </span>
                    <h3 className="text-[13px] sm:text-base font-semibold text-[#1A1F2C] mt-0.5 leading-tight group-hover:text-[#D91680] transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-[11px] text-[#6A758E] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                        {item.description}
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
