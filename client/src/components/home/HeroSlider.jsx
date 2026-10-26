import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Play, Pause, Star, Truck, Leaf, HandHeart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

/**
 * Countryside Craft — Premium Full-Width Dynamic Hero Carousel
 * 
 * Features:
 * - Full-bleed background product photography filling 100% of the slide
 * - Refined editorial warm ivory readability gradient overlay
 * - Editorial typography with Playfair Display headings and Plus Jakarta Sans body
 * - Authentic wide product photographs (1920x800) with responsive focal positioning
 * - Auto-rotation (6s), hover pause, keyboard navigation, touch swipe & WCAG pause control
 * - Integrated trust features strip directly beneath
 */
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/carousel/carousel-pouches-wide.jpg',
    fallbackImage: '/images/carousel/carousel-pouches.jpg',
    imageAlt: 'Handcrafted jute pouches with natural textures, playful accents, and thoughtful artisan details',
    eyebrow: 'HANDCRAFTED • MADE WITH CARE',
    headline: 'Little Details. Beautifully Handmade.',
    description: 'Discover handcrafted jute pouches with natural textures, playful accents, and thoughtful artisan details.',
    primaryCta: 'Shop Handmade Pouches',
    primaryTarget: 'pouch',
    secondaryCta: 'Explore All Collections',
    secondaryTarget: '',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-center',
  },
  {
    id: 2,
    image: '/images/carousel/carousel-floral-bags-wide.jpg',
    fallbackImage: '/images/carousel/carousel-floral-bags.jpg',
    imageAlt: 'Three tall embroidered floral jute bags with colorful floral designs',
    eyebrow: 'CRAFTED BY HAND • MADE TO GIFT',
    headline: 'A Little Charm in Every Carry.',
    description: 'Explore floral jute bags that bring together beautiful embroidery, natural texture, and everyday practicality.',
    primaryCta: 'Shop Floral Jute Bags',
    primaryTarget: 'bag',
    secondaryCta: 'Explore Collections',
    secondaryTarget: '',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-center',
  },
  {
    id: 3,
    image: '/images/carousel/carousel-vibrant-collection-wide.jpg',
    fallbackImage: '/images/carousel/carousel-vibrant-collection.jpg',
    imageAlt: 'Assorted decorative jute bags with colorful trims and handmade embellishments',
    eyebrow: 'ARTISAN COLLECTION • THOUGHTFULLY MADE',
    headline: 'Every Bag Has a Story.',
    description: 'From colorful trims to playful handmade details, discover jute bags created to make gifting and everyday moments special.',
    primaryCta: 'Browse the Collection',
    primaryTarget: '',
    secondaryCta: 'Inquire About Bulk Orders',
    secondaryTarget: 'bulk-whatsapp',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-center',
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

  // Check for reduced motion preference
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

  // Autoplay management
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

  // Touch Swipe handlers
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
      handleNext(); // swipe left
    } else if (distance < -minSwipeDistance) {
      handlePrev(); // swipe right
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Handle WhatsApp bulk inquiry
  const handleBulkInquiry = () => {
    const msg = buildWhatsAppInquiryMessage('custom-bulk');
    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  const handleSecondaryCta = (slide) => {
    if (slide.secondaryTarget === 'bulk-whatsapp') {
      handleBulkInquiry();
    } else if (typeof onNavigate === 'function') {
      onNavigate('products', slide.secondaryTarget || undefined);
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section
      aria-label="Hero Carousel"
      className="w-full bg-[#FAF8F5] pt-2 sm:pt-4"
    >
      {/* 1. Full-Width Photographic Hero Carousel Container */}
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Artisan Collections Showcase"
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD2] min-h-[540px] sm:min-h-[560px] lg:min-h-[580px] xl:min-h-[620px] select-none flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Full-Bleed Background Images for all 3 slides */}
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${HERO_SLIDES.length}: ${slide.headline}`}
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
                className={`w-full h-full object-cover ${slide.desktopPosition} sm:${slide.desktopPosition}`}
              />
            </div>
          ))}

          {/* Premium Readability Overlay: Soft Ivory to Transparent Gradient */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-colors duration-500"
            style={{
              background: 'linear-gradient(90deg, rgba(248,244,236,0.96) 0%, rgba(248,244,236,0.91) 28%, rgba(248,244,236,0.65) 48%, rgba(248,244,236,0.18) 72%, transparent 100%)',
            }}
          />

          {/* Mobile localized gradient wash for optimal text contrast */}
          <div
            className="lg:hidden absolute inset-0 z-20 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(248,244,236,0.96) 0%, rgba(248,244,236,0.88) 52%, rgba(248,244,236,0.45) 78%, rgba(248,244,236,0.15) 100%)',
            }}
          />

          {/* Slide Content Layer: Eyebrow, Heading, Description, and Dual CTAs */}
          <div className="relative z-30 w-full h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-12 sm:py-16">
            <div className="max-w-xl lg:max-w-[580px] xl:max-w-[620px] flex flex-col items-start text-left">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#E7DFD2] shadow-2xs mb-3 sm:mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#C49A58]" aria-hidden="true" />
                <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-widest text-[#34271D]">
                  {activeSlide.eyebrow}
                </span>
              </div>

              {/* Editorial Serif Headline */}
              <h1 className="font-serif-display font-bold text-[#34271D] text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] leading-[1.12] tracking-tight">
                {activeSlide.headline}
              </h1>

              {/* Supporting Body Copy */}
              <p className="font-sans text-sm sm:text-base lg:text-[17px] text-[#5A4D41] leading-relaxed max-w-lg mt-3 sm:mt-4">
                {activeSlide.description}
              </p>

              {/* Dual Action CTA Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {/* Primary Button */}
                <button
                  id="hero-primary-cta"
                  type="button"
                  onClick={() => onNavigate('products', activeSlide.primaryTarget)}
                  className="px-7 py-3.5 rounded-full bg-[#254535] hover:bg-[#1A3427] text-[#F8F4EC] font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer group"
                >
                  <span>{activeSlide.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>

                {/* Secondary Button */}
                <button
                  id="hero-secondary-cta"
                  type="button"
                  onClick={() => handleSecondaryCta(activeSlide)}
                  className="px-7 py-3.5 rounded-full border border-[#34271D]/40 hover:border-[#34271D] bg-white/50 hover:bg-white/85 backdrop-blur-xs text-[#34271D] font-medium text-xs sm:text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {activeSlide.secondaryTarget === 'bulk-whatsapp' && (
                    <MessageCircle className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />
                  )}
                  <span>{activeSlide.secondaryCta}</span>
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
                      ? 'w-6 bg-[#254535]'
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
      </div>

      {/* 2. Trust Badges Strip (4 Columns directly beneath the photographic hero) */}
      <div className="w-full bg-[#FAF8F5] border-y border-[#E8E2D6] mt-6 sm:mt-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#E8E2D6]">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center space-x-3.5 lg:px-6">
                <div className="shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.6] text-[#254535]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-[15px] font-bold text-[#34271D] leading-tight">
                    {title}
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#5A4D41] mt-0.5 leading-snug">
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
