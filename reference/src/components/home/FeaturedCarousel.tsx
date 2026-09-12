import React, { useState } from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

interface FeaturedCarouselProps {
  onNavigate: (view: string, param?: string) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'festive' | 'all'>('bestseller');

  const filtered = products.filter((p) => {
    if (!p.isActive) return false;
    if (activeTab === 'bestseller') return p.isBestseller || p.ratingAverage >= 4.9;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'festive') return p.category === 'festive-wedding';
    return true;
  });

  return (
    <section className="py-16 bg-[#FAF7F2] border-y border-[#E9DFD1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#B33E2B]" />
              <span>Artisan Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
              Featured Handcrafted Totes
            </h2>
          </div>

          {/* Filter Tabs (Wedtree inspired) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'bestseller'
                  ? 'bg-[#3B362F] text-white shadow-sm'
                  : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
              }`}
            >
              🔥 Top Selling
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'new'
                  ? 'bg-[#3B362F] text-white shadow-sm'
                  : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
              }`}
            >
              ✨ New Arrivals
            </button>

            <button
              onClick={() => setActiveTab('festive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'festive'
                  ? 'bg-[#3B362F] text-white shadow-sm'
                  : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
              }`}
            >
              🎁 Festive & Gifting
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === 'all'
                  ? 'bg-[#3B362F] text-white shadow-sm'
                  : 'bg-[#EDE4D5] text-[#544A3D] hover:bg-[#E2D5C2]'
              }`}
            >
              View All ({products.filter((p) => p.isActive).length})
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              onNavigate('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98"
          >
            <span>Explore All {products.length} Tote Bag Designs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
