import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

interface SignatureSpotlightProps {
  onNavigate: (view: string, param?: string) => void;
}

export const SignatureSpotlight: React.FC<SignatureSpotlightProps> = ({ onNavigate }) => {
  const { products } = useStore();
  const { addToCart } = useCart();

  // Find the Signature Indigo or Kalamkari Tote
  const spotlightProduct =
    products.find((p) => p._id === 'prod-1') ||
    products.find((p) => p.isBestseller) ||
    products[0];

  if (!spotlightProduct) return null;

  return (
    <section className="py-20 bg-[#26221D] text-[#FAF7F2] overflow-hidden relative">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D5C8B4_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image & Video Gallery Side (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#423B32] bg-[#1E1B17] aspect-[4/3] group">
              <img
                src={spotlightProduct.images[0]}
                alt={spotlightProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-md text-[#241F18] text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ★ Signature Artisan Series
              </div>

              {spotlightProduct.discountPercent > 0 && (
                <div className="absolute bottom-4 left-4 bg-[#B33E2B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Save {spotlightProduct.discountPercent}% This Week
                </div>
              )}
            </div>

            {/* Micro thumbnail grid */}
            <div className="grid grid-cols-3 gap-3">
              {spotlightProduct.images.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden aspect-[4/3] border border-[#3D362C] bg-[#1E1B17]"
                >
                  <img src={img} alt="detail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Story & Purchase Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-300 font-mono mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heirloom Craft Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-display font-bold text-[#FAF6F0] leading-tight">
                {spotlightProduct.name}
              </h2>

              <p className="text-sm text-amber-200/90 font-serif-display italic mt-2">
                "{spotlightProduct.tagline || 'Crafted with centuries-old mud resist hand block techniques in Bagru.'}"
              </p>
            </div>

            {/* Narrative Story */}
            <p className="text-xs sm:text-sm text-[#CBC1B3] leading-relaxed">
              {spotlightProduct.detailedStory || spotlightProduct.description}
            </p>

            {/* Key Specs Checkpoints */}
            <div className="space-y-2.5 pt-2 border-t border-[#3D362C] text-xs text-[#E3D9CD]">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Canvas:</strong> {spotlightProduct.material || '450 GSM Heavyweight Organic Cotton'}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Laptop Capacity:</strong> Padded sleeve fits up to 15.6" laptops + notebooks</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Hardware:</strong> YKK antiqued brass zipper & internal security pouch</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-4 border-t border-[#3D362C]">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {formatCurrency(spotlightProduct.price)}
                </span>
                {spotlightProduct.originalPrice && spotlightProduct.originalPrice > spotlightProduct.price && (
                  <span className="text-sm text-[#998E7F] line-through">
                    {formatCurrency(spotlightProduct.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-amber-300 font-medium ml-2">
                  (Includes Detachable Key Ring)
                </span>
              </div>

              <p className="text-[11px] text-[#A39684] mt-1 italic">
                * Shipping calculated extra based on destination pincode
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  id="spotlight-add-to-bag"
                  onClick={() => addToCart(spotlightProduct, 1)}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-[#FAF6EE] text-[#26221D] font-bold text-xs uppercase tracking-wider hover:bg-[#EAE0CF] transition-colors flex items-center justify-center space-x-2 shadow-lg active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-[#8C5E3C]" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => onNavigate('product-detail', spotlightProduct.slug)}
                  className="py-3.5 px-5 rounded-xl bg-[#3E372E] hover:bg-[#4D453A] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center space-x-1.5 border border-[#52493D]"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
