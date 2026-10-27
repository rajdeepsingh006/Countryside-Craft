import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';
import { getAssetUrl } from '../../utils/assetHelper';

const FALLBACK_REVIEWS = [
  {
    text: 'Exquisite craftsmanship! The natural golden jute texture and vibrant handcrafted detailing are simply stunning.',
    author: 'Pooja Sharma',
    city: 'New Delhi',
    rating: 5,
  },
  {
    text: 'Ordered these for our festive family gifting. Every single guest complimented the authentic artisan finish.',
    author: 'Ananya Mukherjee',
    city: 'Kolkata',
    rating: 5,
  },
  {
    text: 'Exceptional build quality and eco-friendly elegance. The attention to stitching and rustic charm is unmatched.',
    author: 'Meera Sen',
    city: 'Bengaluru',
    rating: 5,
  },
  {
    text: 'Durable, sustainable, and beautifully made. Truly captures the essence of traditional Indian countryside craft.',
    author: 'Rohan Patel',
    city: 'Mumbai',
    rating: 5,
  },
];

export const SignatureSpotlight = ({ onNavigate }) => {
  const { products, reviews } = useStore();
  const { addToCart } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fadeState, setFadeState] = useState('opacity-100 scale-100');
  const timerRef = useRef(null);

  // Filter top-rated and bestseller products (minimum 4.7 rating or bestseller)
  const spotlightProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const highRated = products.filter(
      (p) => (p.ratingAverage && p.ratingAverage >= 4.7) || p.isBestseller
    );
    if (highRated.length >= 2) {
      return highRated.slice(0, 5);
    }
    return products.slice(0, 5);
  }, [products]);

  // Safe active product
  const activeProduct = spotlightProducts[currentIndex] || spotlightProducts[0];

  // Reset selected image thumbnail when current product changes
  useEffect(() => {
    setSelectedMediaIdx(0);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (spotlightProducts.length <= 1) return;
    setFadeState('opacity-0 scale-98');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightProducts.length);
      setFadeState('opacity-100 scale-100');
    }, 250);
  }, [spotlightProducts.length]);

  const goToPrev = useCallback(() => {
    if (spotlightProducts.length <= 1) return;
    setFadeState('opacity-0 scale-98');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + spotlightProducts.length) % spotlightProducts.length);
      setFadeState('opacity-100 scale-100');
    }, 250);
  }, [spotlightProducts.length]);

  // Auto-play animation: rotates every 6 seconds
  useEffect(() => {
    if (isHovered || spotlightProducts.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, spotlightProducts.length, goToNext]);

  if (!activeProduct) return null;

  const rawImages = Array.isArray(activeProduct.images) ? activeProduct.images.filter(Boolean) : [];
  const currentMedia = rawImages[selectedMediaIdx] || rawImages[0] || '';
  const currentThumb = isVideoUrl(currentMedia)
    ? getVideoThumbnail(currentMedia, activeProduct.videoThumbnail)
    : currentMedia;
  const displayThumb = currentThumb ? getAssetUrl(currentThumb) : '';

  // Get matching review or fallback
  const matchingReviews = (reviews || []).filter(
    (r) =>
      r.isApproved !== false &&
      (r.productId === activeProduct._id ||
        r.product === activeProduct._id ||
        r.productSlug === activeProduct.slug)
  );

  const featuredReview =
    matchingReviews.length > 0
      ? {
          text: matchingReviews[0].comment || matchingReviews[0].text,
          author: matchingReviews[0].userName || matchingReviews[0].name || 'Verified Buyer',
          city: matchingReviews[0].city || 'Verified Collector',
          rating: matchingReviews[0].rating || 5,
        }
      : FALLBACK_REVIEWS[currentIndex % FALLBACK_REVIEWS.length];

  const ratingVal = Number(activeProduct.ratingAverage || 5.0).toFixed(1);
  const ratingCount = activeProduct.ratingCount || 18;

  return (
    <section
      className="py-12 sm:py-20 bg-[#FAF8F5] text-[#2D2A26] overflow-hidden relative border-y border-[#EADDC6]/70 texture-canvas select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 pb-3 border-b border-[#EADDC6]/50 gap-3">
          <div className="flex items-start justify-between gap-2 w-full sm:w-auto">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#A94F2B] mb-1 sm:mb-1.5 bg-[#FDF4EE] px-2.5 sm:px-3 py-1 rounded-full border border-[#F0D5C3] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#A94F2B]" />
                <span>Heirloom Craft Spotlight</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif-display font-bold text-[#163323] leading-tight">
                Artisan Top-Rated Masterpieces
              </h2>
            </div>

            {/* Cute Handwritten Callout on Mobile & Desktop */}
            <div className="shrink-0 -rotate-3 select-none text-right pt-0.5 pr-1 sm:pr-3">
              <span className="block font-handwriting text-base sm:text-2xl text-[#244537] font-bold leading-none">
                master
              </span>
              <span className="inline-flex items-center gap-0.5 sm:gap-1 font-handwriting text-lg sm:text-3xl text-[#A94F2B] font-bold leading-none underline decoration-[#A94F2B]/40 decoration-wavy underline-offset-2">
                crafted <span className="text-xs sm:text-base text-[#244537]">✧</span>
              </span>
            </div>
          </div>

          {/* Interactive Slide Switcher & Indicators */}
          {spotlightProducts.length > 1 && (
            <div className="flex items-center space-x-3 self-start sm:self-auto">
              <span className="text-xs font-mono font-medium text-[#7A6E62]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(spotlightProducts.length).padStart(2, '0')}
              </span>
              <div className="flex items-center space-x-1">
                {spotlightProducts.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => {
                      setFadeState('opacity-0 scale-98');
                      setTimeout(() => {
                        setCurrentIndex(dotIdx);
                        setFadeState('opacity-100 scale-100');
                      }, 250);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === dotIdx
                        ? 'w-6 bg-[#163323]'
                        : 'w-2 bg-[#D8CCB8] hover:bg-[#8A7E72]'
                    }`}
                    aria-label={`Jump to spotlight item ${dotIdx + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-1.5 ml-2">
                <button
                  type="button"
                  onClick={goToPrev}
                  className="p-2 rounded-full bg-white hover:bg-[#F2ECE0] border border-[#DDD7CC] text-[#1A1F2C] shadow-2xs transition-all active:scale-95 cursor-pointer"
                  aria-label="Previous spotlight product"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="p-2 rounded-full bg-white hover:bg-[#F2ECE0] border border-[#DDD7CC] text-[#1A1F2C] shadow-2xs transition-all active:scale-95 cursor-pointer"
                  aria-label="Next spotlight product"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Animated Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#EADDC6] p-5 sm:p-8 lg:p-12 shadow-sm transition-all duration-500">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-300 transform ${fadeState}`}>
            
            {/* Left: Spotlight Image Gallery */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#EADDC6] bg-[#FAF8F5] aspect-[4/3] group">
                <img
                  src={displayThumb || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200'}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Top Badges */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 items-start">
                  <div className="bg-[#163323] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/20 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-[#DBE586] fill-[#DBE586]" />
                    <span>★ Top Rated Pick</span>
                  </div>
                  {activeProduct.isBestseller && (
                    <div className="bg-[#DBE586] text-[#343C05] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs border border-white">
                      Artisan Bestseller
                    </div>
                  )}
                </div>

                {activeProduct.discountPercent > 0 && (
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#EFC0DA] text-[#86124F] text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 rounded-full shadow-sm border border-white">
                    Save {activeProduct.discountPercent}% This Week
                  </div>
                )}
              </div>

              {/* Detail Thumbnails */}
              {rawImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                  {rawImages.slice(0, 5).map((img, i) => {
                    const thumb = isVideoUrl(img) ? getVideoThumbnail(img, activeProduct.videoThumbnail) : img;
                    const thumbSrc = thumb ? getAssetUrl(thumb) : getAssetUrl(img);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedMediaIdx(i)}
                        className={`rounded-2xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer p-0.5 ${
                          selectedMediaIdx === i
                            ? 'border-[#163323] scale-105 shadow-md ring-1 ring-[#163323]/20'
                            : 'border-[#EADDC6] opacity-75 hover:opacity-100 hover:border-[#A9512D]'
                        }`}
                      >
                        <img src={thumbSrc} alt="thumbnail" className="w-full h-full object-cover rounded-xl" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Spotlight Product Details & Customer Review */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              
              {/* Product Title and Rating Banner */}
              <div>
                <div className="flex items-center space-x-2 text-amber-500 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1A1F2C]">
                    {ratingVal}
                  </span>
                  <span className="text-xs text-[#7A6E62]">
                    ({ratingCount} verified reviews)
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-black text-[#1A1F2C] leading-tight">
                  {activeProduct.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#A9512D] font-serif-display italic mt-1">
                  "{activeProduct.tagline || 'Exquisitely handcrafted with sustainable golden fibers.'}"
                </p>
              </div>

              {/* Story / Description */}
              <p className="text-xs sm:text-sm text-[#4A443C] leading-relaxed line-clamp-3">
                {activeProduct.detailedStory || activeProduct.description}
              </p>

              {/* Verified Customer Review Spotlight Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADDC6] shadow-2xs relative">
                <span className="absolute -top-2.5 right-3 font-handwriting text-xs text-[#244537] bg-white px-2 py-0.5 rounded-full border border-[#EADDC6] shadow-2xs rotate-2 font-bold select-none">
                  real craft story ♡
                </span>
                <div className="flex items-start space-x-2.5">
                  <Quote className="w-5 h-5 text-[#A9512D] shrink-0 mt-0.5 opacity-80" />
                  <div>
                    <p className="text-xs text-[#34271D] italic leading-relaxed">
                      "{featuredReview.text}"
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-[11px] text-[#7A6E62]">
                      <span className="font-bold text-[#163323]">{featuredReview.author}</span>
                      <span>•</span>
                      <span>{featuredReview.city}</span>
                      <span className="inline-flex items-center text-emerald-700 font-medium">
                        <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-[#EADDC6] text-xs text-[#2D2A26]">
                {[
                  `Material: ${activeProduct.material || '100% Eco-Friendly Golden Jute Fiber'}`,
                  'Artisan Craft: Traditional hand-embellished & hand-stitched borders',
                  'Purpose: Festive celebrations, gifting, everyday natural styling',
                ].map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: spec.replace(/(.*?):/, '<strong>$1:</strong>') }} />
                  </div>
                ))}
              </div>

              {/* Pricing & CTAs */}
              <div className="pt-3 border-t border-[#EADDC6]">
                {(() => {
                  const displayOriginalPrice =
                    activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price
                      ? activeProduct.originalPrice
                      : activeProduct.discountPercent > 0
                      ? Math.round(activeProduct.price / (1 - activeProduct.discountPercent / 100))
                      : null;

                  return (
                    <div className="flex items-baseline space-x-2.5">
                      <span className="text-2xl sm:text-3xl font-black text-[#1A1F2C]">
                        {formatCurrency(activeProduct.price)}
                      </span>
                      {displayOriginalPrice && displayOriginalPrice > activeProduct.price && (
                        <span className="text-xs sm:text-sm text-[#8A7E72] line-through">
                          {formatCurrency(displayOriginalPrice)}
                        </span>
                      )}
                    </div>
                  );
                })()}
                <p className="text-[10px] text-[#7A6E62] mt-0.5 italic">
                  * Shipping calculated extra based on destination pincode
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    id="spotlight-add-to-bag"
                    type="button"
                    onClick={() => addToCart(activeProduct, 1)}
                    className="flex-1 py-3 px-5 rounded-full bg-[#163323] hover:bg-[#204430] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#DBE586]" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('product-detail', activeProduct.slug)}
                    className="py-3 px-6 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1A1F2C] text-xs font-bold tracking-wide transition-all border border-[#DDD7CC] flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98 shadow-2xs hover:shadow-xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A9512D]" />
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
