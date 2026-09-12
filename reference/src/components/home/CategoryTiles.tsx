import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CategoryTilesProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onNavigate }) => {
  const { categories, products } = useStore();

  return (
    <section className="py-16 bg-[#FBF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8DFD0]">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
              Shop by Craft & Occasion
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="mt-3 md:mt-0 text-xs sm:text-sm font-bold text-[#8C5E3C] hover:text-[#5E3B20] flex items-center space-x-1 transition-colors group"
          >
            <span>View All Tote Bags</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid of Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug && p.isActive).length;
            return (
              <div
                key={cat._id}
                onClick={() => {
                  onNavigate('products', cat.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E5DAC8] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Info Overlay / Footer */}
                <div className="p-3 bg-[#FAF7F2] flex-1 flex flex-col justify-between">
                  <h3 className="font-serif-display font-bold text-xs sm:text-sm text-[#2D261E] group-hover:text-[#8C5E3C] transition-colors leading-snug line-clamp-2">
                    {cat.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#857764]">
                    <span>{count} {count === 1 ? 'Design' : 'Designs'}</span>
                    <span className="text-[#8C5E3C] font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
