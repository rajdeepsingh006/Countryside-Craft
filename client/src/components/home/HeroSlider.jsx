import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Play, Pause, Star, Truck, Leaf, HandHeart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

/**
 * Countryside Craft — Premium Full-Bleed Dynamic Hero Announcement Carousel
 * 
 * Configured with the authentic wide product photographs:
 * 1. Three Tall Floral Bags (from reference image)
 * 2. Assorted Decorative Jute Bags Collection
 * 3. Handcrafted Jute Pouches with Mirrorwork
 */
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/carousel/carousel-vibrant-collection-wide.jpg',
    fallbackImage: '/images/carousel/carousel-vibrant-collection.jpg',
    imageAlt: 'Assorted Decorative Jute Bags with Colorful Trims and Embroidery',
    decorBadge: 'SLOW CRAFT ARTISAN',
    brandTitle: 'Countryside Craft',
    tagline: 'Artisan Heritage Collection',
    title: 'Festive Decorative Jute Bags',
    description: 'Traditional handcrafted totes and festive favor bags embellished with elegant borders, tassel details, and vibrant handmade motifs.',
    primaryCta: 'BROWSE VIBRANT COLLECTION',
    primaryTarget: '',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-[75%_center]',
  },
  {
    id: 2,
    image: '/images/carousel/carousel-floral-bags-wide.jpg',
    fallbackImage: '/images/carousel/carousel-floral-bags.jpg',
    imageAlt: 'Three Tall Floral Handcrafted Jute Bags on Wooden Table',
    decorBadge: 'SLOW CRAFT ARTISAN',
    brandTitle: 'Countryside Craft',
    tagline: 'Artisan Heritage Collection',
    title: 'Vibrant Jute Bag Collection',
    description: 'A colorful collection of handcrafted jute bags featuring elegant trims, embroidery, floral accents, and thoughtful gift designs.',
    primaryCta: 'SHOP FLORAL JUTE BAGS',
    primaryTarget: '',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-[75%_center]',
  },
  {
    id: 3,
    image: '/images/carousel/carousel-pouches-wide.jpg',
    fallbackImage: '/images/carousel/carousel-pouches.jpg',
    imageAlt: 'Handcrafted Jute Pouches with Mirror Work and Colorful Beads',
    decorBadge: 'HANDCRAFTED HERITAGE',
    brandTitle: 'Countryside Craft',
    tagline: 'Handmade With Love',
    title: 'Crafted by Hand • Made to Gift',
    description: 'Rustic textures, shimmering mirror-work charms, and colorful bead details in charming handcrafted pouches and favors.',
    primaryCta: 'EXPLORE HANDMADE POUCHES',
    primaryTarget: 'pouch',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-[75%_center]',
  },
];

const TRUST_FEATURES = [
  {
    icon: Star,
    title: '5,000+ Happy Customers',
    sub: 'Loved by craft & nature enthusiasts',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Dispatch',
    sub: 'Within 4-7 business days',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Materials',
    sub: '100% natural & biodegradable',
  },
  {
    icon: HandHeart,
    title: 'Handcrafted with Love',
    sub: 'Supporting rural artisans',
  },
];

export const HeroSlider = ({ onNavigate }) => {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused || isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      if (!document.hidden) {
        handleNext();
      }
    }, 6000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, isHovered, handleNext, currentSlide]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleBulkInquiry = () => {
    const msg = buildWhatsAppInquiryMessage('custom-bulk');
    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section aria-label="Hero Announcement Banner" className="w-full bg-[#FAF8F5]">
      {/* 1. Full-Bleed Edge-to-Edge Hero Banner */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Artisan Collections Showcase"
        className="relative w-full overflow-hidden select-none flex items-center min-h-[460px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[600px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-Bleed Background Images for all slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${HERO_SLIDES.length}: ${slide.tagline} - ${slide.title}`}
            aria-hidden={currentSlide !== idx}
            className={`absolute inset-0 w-full h-full ${
              reducedMotion
                ? currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                : `transition-opacity duration-700 ease-in-out ${
                    currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`
            }`}
          >
            <img
              src={getAssetUrl(slide.image)}
              alt={slide.imageAlt}
              loading={idx === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                if (slide.fallbackImage && e.currentTarget.src !== slide.fallbackImage) {
                  e.currentTarget.src = slide.fallbackImage;
                }
              }}
              className={`w-full h-full object-cover ${slide.mobilePosition || 'object-[75%_center]'} sm:${slide.desktopPosition}`}
            />
          </div>
        ))}

        {/* Subtle Warm Ivory Readability Gradient Overlay — allows rustic sunlit wall and textures to shine through */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(248,244,236,0.6) 0%, rgba(248,244,236,0.4) 35%, rgba(248,244,236,0.15) 58%, transparent 80%)',
          }}
        />

        {/* Mobile localized gradient wash for optimal text contrast */}
        <div
          className="sm:hidden absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(248,244,236,0.85) 0%, rgba(248,244,236,0.65) 55%, rgba(248,244,236,0.2) 85%, transparent 100%)',
          }}
        />

        {/* Content Container aligned over the sunlit wall on left */}
        <div className="relative z-30 w-full h-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 py-8 sm:py-14 flex flex-col justify-center">
          <div className="max-w-xl lg:max-w-[560px] xl:max-w-[620px] flex flex-col items-start text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#DDD7CC] shadow-2xs mb-2">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A9512D]" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#163323]">
                {activeSlide.decorBadge}
              </span>
            </div>

            {/* Brand Title (Serif Display matching Reference Image 1) */}
            <div className="mt-0.5 sm:mt-1">
              <span className="font-serif-display font-bold text-3xl sm:text-5xl lg:text-[54px] text-[#163323] leading-tight">
                {activeSlide.brandTitle}
              </span>
            </div>

            {/* Tagline */}
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[44px] font-serif-display font-bold text-[#A9512D] leading-tight mt-0.5 sm:mt-1">
              {activeSlide.tagline}
            </h1>

            {/* Product Title / Subtitle */}
            <h2 className="text-sm sm:text-base md:text-xl font-serif-display font-bold text-[#163323] mt-0.5 sm:mt-1">
              {activeSlide.title}
            </h2>

            {/* Description */}
            <p className="font-sans text-[11px] sm:text-sm md:text-[15px] text-[#4A3E36] leading-relaxed max-w-lg mt-2 sm:mt-2.5">
              {activeSlide.description}
            </p>

            {/* Dual CTAs: Primary Storefront CTA + WhatsApp Bulk Inquiry */}
            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              {/* Primary Button */}
              <button
                id="hero-primary-cta"
                type="button"
                onClick={() => onNavigate('products', activeSlide.primaryTarget)}
                className="btn-shimmer-effect px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#163323] hover:bg-[#204430] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center border border-[#163323]"
              >
                <span>{activeSlide.primaryCta}</span>
              </button>

              {/* Secondary Button: WhatsApp Inquiry */}
              <button
                id="hero-whatsapp-inquiry-cta"
                type="button"
                onClick={handleBulkInquiry}
                className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border border-[#163323]/40 bg-white/60 hover:bg-white/90 text-[#163323] font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-xs shadow-xs hover:shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#163323] shrink-0" aria-hidden="true" />
                <span>INQUIRE FOR CUSTOM &amp; BULK FAVORS</span>
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Controls (Bottom Right Floating Bar) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center space-x-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#E7DFD2] text-[#34271D] shadow-md select-none">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center space-x-1.5 px-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-[#163323]'
                    : 'w-2 bg-[#34271D]/30 hover:bg-[#34271D]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={currentSlide === idx ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Autoplay Pause / Play Accessible Toggle */}
          <div className="pl-1 border-l border-[#E7DFD2]">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#34271D]/70 hover:text-[#34271D] transition-colors cursor-pointer"
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              ) : (
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Trust Badges Strip (4 Columns directly beneath the photographic hero) */}
      <div className="w-full bg-[#FAF8F5] border-y border-[#E8E2D6]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#E8E2D6]">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center space-x-3.5 lg:px-6">
                <div className="shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.6] text-[#163323]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-[15px] font-bold text-[#163323] leading-tight">
                    {title}
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#55665B] mt-0.5 leading-snug">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
