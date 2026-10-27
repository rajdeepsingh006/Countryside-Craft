import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Star,
  Truck,
  Leaf,
  HandHeart,
  Search,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

// Botanical Olive Sprig SVGs matching reference mockup
const CornerOliveSprig = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M85 15 C55 25 35 50 20 85 C23 83 26 80 28 76 C38 48 58 28 85 15 Z" opacity="0.4" />
    <path d="M82 18 C72 20 62 16 57 11 C65 22 75 24 82 18 Z" />
    <path d="M68 25 C58 26 50 20 46 14 C52 27 63 31 68 25 Z" />
    <path d="M54 35 C43 36 36 29 32 23 C38 37 49 41 54 35 Z" />
    <path d="M74 22 C67 31 62 40 73 34 C77 28 76 24 74 22 Z" />
    <path d="M60 32 C53 42 47 50 58 45 C63 39 62 34 60 32 Z" />
    <path d="M46 44 C39 54 34 62 44 57 C49 51 48 46 46 44 Z" />
  </svg>
);

const OliveSprigLeft = ({ className = 'w-10 h-8' }) => (
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

const OliveSprigRight = ({ className = 'w-10 h-8' }) => (
  <svg viewBox="0 0 80 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: 'scaleX(-1)' }}>
    <path d="M75 42 C45 32 25 22 5 10 C18 18 38 28 75 42 Z" opacity="0.35" />
    <path d="M8 12 C18 10 24 14 26 20 C18 16 11 15 8 12 Z" />
    <path d="M22 19 C32 17 38 22 40 27 C32 23 25 22 22 19 Z" />
    <path d="M38 27 C48 24 54 29 56 34 C48 30 41 30 38 27 Z" />
    <path d="M12 9 C18 4 25 6 28 12 C22 9 16 8 12 9 Z" />
    <path d="M26 15 C33 9 40 12 43 18 C36 15 30 14 26 15 Z" />
    <path d="M42 23 C49 17 56 20 59 26 C52 23 46 22 42 23 Z" />
  </svg>
);

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/carousel/carousel-vibrant-collection-wide.jpg',
    fallbackImage: '/images/carousel/carousel-vibrant-collection.jpg',
    imageAlt: 'Assorted Decorative Jute Bags with Colorful Trims and Embroidery',
    decorBadge: 'HANDCRAFTED HERITAGE',
    brandTitle: 'Countryside Craft',
    tagline: 'Artisan Heritage Collection',
    title: 'Festive Decorative Jute Bags',
    description: 'Traditional handcrafted totes and festive favor bags embellished with elegant borders, tassel details, and vibrant handmade motifs.',
    primaryCta: 'BROWSE VIBRANT COLLECTION',
    primaryTarget: '',
    desktopPosition: 'object-right center',
    mobilePosition: 'object-[82%_center]',
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
    mobilePosition: 'object-[82%_center]',
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
    mobilePosition: 'object-[84%_center]',
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
    sub: 'Within 4–7 business days',
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
  const autoplayTimerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused || isHovered) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      handleNext();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, isHovered, handleNext]);

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
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* MOBILE-ONLY HERO LAYOUT (Exact Match to User Reference Mockup) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Artisan Collections Showcase (Mobile)"
        className="sm:hidden relative w-full overflow-hidden select-none min-h-[580px] rounded-b-[2.5rem] shadow-sm flex flex-col justify-between pt-3 pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full Photographic Slide Background */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            aria-hidden={currentSlide !== idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
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
              className={`w-full h-full object-cover ${slide.mobilePosition || 'object-[82%_center]'}`}
            />
          </div>
        ))}

        {/* Subtle Warm Lateral Fade on Left for Text Contrast on Mobile */}
        <div
          className="sm:hidden absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(248,244,236,0.3) 0%, rgba(248,244,236,0.1) 50%, transparent 80%)',
          }}
        />

        {/* Direct Layout on Left (Over Sunlit Rustic Plaster Wall, No Heavy Box) */}
        <div className="relative z-20 w-[84%] max-w-[325px] pt-4 pb-2 px-4 flex flex-col items-start text-left my-auto">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#D5C7B2] bg-white/85 text-[#8F3D1F] text-[9.5px] font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#8F3D1F]" aria-hidden="true" />
            <span>{activeSlide.decorBadge}</span>
          </div>

          {/* Brand Title */}
          <span className="font-serif-display font-bold text-[31px] text-[#163323] leading-[1.05] block tracking-tight">
            {activeSlide.brandTitle}
          </span>

          {/* Tagline (2 Lines in Rich Terracotta) */}
          <h1 className="font-serif-display font-bold text-[26px] text-[#9C4D26] leading-[1.08] block mt-1">
            {activeSlide.tagline}
          </h1>

          {/* Subtitle */}
          <h2 className="font-serif-display font-bold text-[14px] text-[#163323] mt-2 leading-snug">
            {activeSlide.title}
          </h2>

          {/* Small Terracotta Divider Bar */}
          <div className="w-8 h-[2.5px] bg-[#9C4D26] rounded-full my-3" />

          {/* Description */}
          <p className="font-sans text-[11px] text-[#34271D] leading-relaxed mb-4 max-w-[275px]">
            {activeSlide.description}
          </p>

          {/* Dual CTAs Stacked Vertically */}
          <div className="w-full space-y-2">
            {/* Primary Dark Green Button with Leaf Icon & Arrow */}
            <button
              id="hero-mobile-primary-cta"
              type="button"
              onClick={() => onNavigate('products', activeSlide.primaryTarget)}
              className="w-full py-2.5 px-4 rounded-full bg-[#163323] hover:bg-[#204430] text-white text-[10.5px] font-bold uppercase tracking-wider flex items-center justify-between shadow-sm active:scale-98 transition-all cursor-pointer group border border-[#163323]"
            >
              <span className="flex items-center space-x-2 truncate">
                <Leaf className="w-3.5 h-3.5 text-[#A4B58A] shrink-0" aria-hidden="true" />
                <span className="truncate">{activeSlide.primaryCta}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>

            {/* Secondary Translucent Pill with Search Icon */}
            <button
              id="hero-mobile-whatsapp-cta"
              type="button"
              onClick={handleBulkInquiry}
              className="w-full py-2.5 px-3.5 rounded-full border border-[#163323]/80 bg-[#FAF7F0]/85 hover:bg-[#FAF7F0] text-[#163323] text-[9.5px] font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-2xs active:scale-98 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#163323] shrink-0" aria-hidden="true" />
              <span>INQUIRE FOR CUSTOM &amp; BULK FAVORS</span>
            </button>
          </div>

        </div>

        {/* Floating Centered Carousel Navigation Pill */}
        <div className="relative z-20 mx-auto flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E7DFD2] text-[#34271D] shadow-md select-none mt-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="flex items-center space-x-1.5 px-1">
            {HERO_SLIDES.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToSlide(dotIdx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === dotIdx
                    ? 'w-4 h-2 bg-[#163323]'
                    : 'w-2 h-2 bg-[#D5CBC0] hover:bg-[#8A7A6C]'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DESKTOP HERO LAYOUT (Full-Bleed Editorial Presentation)     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Artisan Collections Showcase (Desktop)"
        className="hidden sm:flex relative w-full overflow-hidden select-none items-center min-h-[520px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[600px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
              className={`w-full h-full object-cover ${slide.desktopPosition}`}
            />
          </div>
        ))}

        {/* Desktop Readability Gradient Overlay over left wall */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(248,244,236,0.65) 0%, rgba(248,244,236,0.35) 38%, rgba(248,244,236,0.1) 60%, transparent 80%)',
          }}
        />

        {/* Content Container aligned over the sunlit wall on left */}
        <div className="relative z-30 w-full h-full max-w-[1440px] mx-auto px-10 lg:px-16 xl:px-20 py-14 flex flex-col justify-center">
          <div className="max-w-xl lg:max-w-[560px] xl:max-w-[620px] flex flex-col items-start text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDD7CC] shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A9512D]" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#163323]">
                {activeSlide.decorBadge}
              </span>
            </div>

            {/* Brand Title */}
            <div className="mt-1">
              <span className="font-serif-display font-bold text-4xl lg:text-[54px] text-[#163323] leading-tight">
                {activeSlide.brandTitle}
              </span>
            </div>

            {/* Tagline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-serif-display font-bold text-[#A9512D] leading-tight mt-1">
              {activeSlide.tagline}
            </h1>

            {/* Product Title / Subtitle */}
            <h2 className="text-base sm:text-lg md:text-xl font-serif-display font-bold text-[#163323] mt-1">
              {activeSlide.title}
            </h2>

            {/* Description */}
            <p className="font-sans text-sm md:text-[15px] text-[#4A3E36] leading-relaxed max-w-lg mt-2.5">
              {activeSlide.description}
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex items-center gap-4 w-auto">
              {/* Primary Button */}
              <button
                id="hero-primary-cta"
                type="button"
                onClick={() => onNavigate('products', activeSlide.primaryTarget)}
                className="btn-shimmer-effect px-8 py-3.5 rounded-full bg-[#163323] hover:bg-[#204430] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center border border-[#163323]"
              >
                <span>{activeSlide.primaryCta}</span>
              </button>

              {/* Secondary Button: WhatsApp Inquiry */}
              <button
                id="hero-whatsapp-inquiry-cta"
                type="button"
                onClick={handleBulkInquiry}
                className="px-7 py-3.5 rounded-full border border-[#163323]/40 bg-white/80 hover:bg-white text-[#163323] font-bold text-xs uppercase tracking-wider transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 backdrop-blur-xs shadow-xs hover:shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#163323] shrink-0" aria-hidden="true" />
                <span>INQUIRE FOR CUSTOM &amp; BULK FAVORS</span>
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Controls (Bottom Right Floating Bar) */}
        <div className="absolute bottom-6 right-8 z-30 flex items-center space-x-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#E7DFD2] text-[#34271D] shadow-md select-none">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

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

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#34271D] transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>

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

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MOBILE-ONLY TRUST FEATURES (Exact Match to Reference Mockup) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="sm:hidden w-full bg-[#FAF7F0] border-b border-[#E8DFCFA] pt-6 pb-5 px-3">
        {/* Top Row: 3 Columns with Vertical Dividers */}
        <div className="grid grid-cols-3 divide-x divide-[#E2D8C8] pb-5 border-b border-[#E8DFCFA]">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-11 h-11 rounded-full bg-[#EDE7DA] border border-[#DDD5C5] flex items-center justify-center mb-2 shadow-2xs">
              <Star className="w-5 h-5 text-[#163323]" aria-hidden="true" />
            </div>
            <p className="font-serif-display font-bold text-xs text-[#163323] leading-tight">
              5,000+ Happy Customers
            </p>
            <p className="text-[10px] text-[#6E6054] mt-1 leading-tight">
              Loved by craft &amp; nature enthusiasts
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-11 h-11 rounded-full bg-[#EDE7DA] border border-[#DDD5C5] flex items-center justify-center mb-2 shadow-2xs">
              <Truck className="w-5 h-5 text-[#163323]" aria-hidden="true" />
            </div>
            <p className="font-serif-display font-bold text-xs text-[#163323] leading-tight">
              Fast &amp; Reliable Dispatch
            </p>
            <p className="text-[10px] text-[#6E6054] mt-1 leading-tight">
              Within 4–7 business days
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-11 h-11 rounded-full bg-[#EDE7DA] border border-[#DDD5C5] flex items-center justify-center mb-2 shadow-2xs">
              <Leaf className="w-5 h-5 text-[#163323]" aria-hidden="true" />
            </div>
            <p className="font-serif-display font-bold text-xs text-[#163323] leading-tight">
              Eco-Friendly Materials
            </p>
            <p className="text-[10px] text-[#6E6054] mt-1 leading-tight">
              100% natural &amp; biodegradable
            </p>
          </div>
        </div>

        {/* Bottom Row: Centered 4th Feature Flanked by Botanical Olive Sprigs */}
        <div className="flex items-center justify-between pt-4 px-2">
          {/* Left Botanical Sprig */}
          <div className="text-[#8C9879] opacity-80 shrink-0">
            <OliveSprigLeft className="w-10 h-8" />
          </div>

          {/* Center 4th Feature */}
          <div className="flex items-center space-x-3 mx-auto">
            <div className="w-11 h-11 rounded-full bg-[#EDE7DA] border border-[#DDD5C5] flex items-center justify-center shrink-0 shadow-2xs">
              <HandHeart className="w-5 h-5 text-[#163323]" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="font-serif-display font-bold text-xs text-[#163323] leading-tight">
                Handcrafted with Love
              </p>
              <p className="text-[10px] text-[#6E6054] mt-0.5 leading-tight">
                Supporting rural artisans
              </p>
            </div>
          </div>

          {/* Right Botanical Sprig */}
          <div className="text-[#8C9879] opacity-80 shrink-0">
            <OliveSprigRight className="w-10 h-8" />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DESKTOP TRUST BADGES STRIP (4 Columns with Dividers)       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block w-full bg-[#FAF8F5] border-y border-[#E8E2D6]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[#E8E2D6]">
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
