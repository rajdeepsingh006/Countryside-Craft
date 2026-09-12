import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const SignatureSpotlight = ({ onNavigate }) => {
  const { products } = useStore();
  const { addToCart } = useCart();

  const spotlightProduct = products.find((p) => p.isBestseller) || products[0];
  if (!spotlightProduct) return null;

  const rawImages = Array.isArray(spotlightProduct.images) ? spotlightProduct.images.filter(Boolean) : [];
  const primaryMedia = rawImages[0] || '';
  const primaryThumb = isVideoUrl(primaryMedia)
    ? getVideoThumbnail(primaryMedia, spotlightProduct.videoThumbnail)
    : primaryMedia;

  return (
    <section className="py-12 sm:py-20 bg-[#FAF8F5] text-[#2D2A26] overflow-hidden relative border-y border-[#EADDC6]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl border border-[#EADDC6] p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Spotlight Image Gallery */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#EADDC6] bg-[#FAF8F5] aspect-[4/3] group">
                <img
                  src={primaryThumb || 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.54.45_PM.jpg'}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#DBE586] text-[#343C05] text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full shadow-sm border border-white">
                  ★ Signature Artisan Series
                </div>
                {spotlightProduct.discountPercent > 0 && (
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#EFC0DA] text-[#86124F] text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full shadow-sm border border-white">
                    Save {spotlightProduct.discountPercent}% This Week
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {rawImages.slice(0, 3).map((img, i) => {
                  const thumb = isVideoUrl(img) ? getVideoThumbnail(img, spotlightProduct.videoThumbnail) : img;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden aspect-[4/3] border border-[#EADDC6] bg-[#FAF8F5]"
                    >
                      <img src={thumb || img} alt="detail" className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spotlight Product Details */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#D91680] mb-2 bg-[#FDF1F7] px-3 py-1 rounded-full border border-[#EFC0DA]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D91680]" />
                  <span>Heirloom Craft Spotlight</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-display font-black text-[#1A1F2C] leading-tight">
                  {spotlightProduct.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#86124F] font-serif-display italic mt-1.5 sm:mt-2">
                  "{spotlightProduct.tagline || 'Crafted with centuries-old handblock techniques.'}"
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed">
                {spotlightProduct.detailedStory || spotlightProduct.description}
              </p>

              <div className="space-y-2 sm:space-y-2.5 pt-2 border-t border-[#EADDC6] text-xs text-[#2D2A26]">
                {[
                  `Canvas: ${spotlightProduct.material || '450 GSM Heavyweight Organic Cotton'}`,
                  'Laptop Capacity: Fits up to 15.6" laptops + notebooks',
                  'Hardware: Antiqued brass zipper & internal security pouch',
                ].map((spec) => (
                  <div key={spec} className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: spec.replace(/(.*?):/, '<strong>$1:</strong>') }} />
                  </div>
                ))}
              </div>

              <div className="pt-3 sm:pt-4 border-t border-[#EADDC6]">
                <div className="flex items-baseline space-x-2.5 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#1A1F2C]">
                    {formatCurrency(spotlightProduct.price)}
                  </span>
                  {spotlightProduct.originalPrice && spotlightProduct.originalPrice > spotlightProduct.price && (
                    <span className="text-xs sm:text-sm text-[#8A7E72] line-through">
                      {formatCurrency(spotlightProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7A6E62] mt-1 italic">
                  * Shipping calculated extra based on destination pincode
                </p>
                <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    id="spotlight-add-to-bag"
                    onClick={() => addToCart(spotlightProduct, 1)}
                    className="flex-1 py-3 sm:py-3.5 px-5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer border border-[#EFC0DA] active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#EFC0DA]" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => onNavigate('product-detail', spotlightProduct.slug)}
                    className="py-3 sm:py-3.5 px-5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2ECE0] text-[#1A1F2C] text-xs font-bold tracking-wide transition-colors flex items-center justify-center space-x-1.5 border border-[#D8CCB8] cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D91680]" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

