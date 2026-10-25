import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Leaf, HandHeart } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

/**
 * Full-Bleed Editorial Hero Carousel — Countryside Craft
 * 
 * Implements a full-background editorial carousel where each slide image
 * covers 100% of the hero container width and height. An adaptive warm ivory
 * gradient overlays the left side to guarantee effortless text contrast while
 * keeping the artisan product photography crisp, prominent, and un-tinted on the right.
 */
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'floral-bags',
    eyebrow: 'HANDCRAFTED • ECO-FRIENDLY',
    headline: 'A little piece\nof nature, woven\ninto every day.',
    description: 'Beautifully handcrafted jute bags and home essentials that bring together tradition, nature and modern living.',
    image: '/images/carousel/carousel-floral-bags.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.52.38_PM.jpg',
    alt: 'Handcrafted Floral Jute Bags',
    ctaPrimary: 'Shop Floral Jute Bags',
    ctaSecondary: 'Explore Collections',
    categoryTarget: '',
    objectPosition: 'center right',
    mobileObjectPosition: '70% center',
  },
  {
    id: 2,
    tag: 'handmade-pouches',
    eyebrow: 'HANDCRAFTED • MADE WITH LOVE',
    headline: 'Crafted by hand,\nmade to gift &\ncherish every day.',
    description: 'Thoughtfully handcrafted jute pouches and accessories, bringing together natural textures, colorful details, and everyday functionality.',
    image: '/images/carousel/carousel-pouches.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.54.45_PM.jpg',
    alt: 'Handcrafted Embellished Jute Pouches',
    ctaPrimary: 'Shop Handmade Pouches',
    ctaSecondary: 'Explore Collections',
    categoryTarget: 'pouch',
    objectPosition: 'center right',
    mobileObjectPosition: '65% center',
  },
  {
    id: 3,
    tag: 'artisan-gifts',
    eyebrow: 'THOUGHTFUL GIFTS • ARTISAN CRAFT',
    headline: 'Gifts with a little\nmore meaning &\nfestive warmth.',
    description: 'Discover distinctive jute bags and handcrafted gifts designed to celebrate special moments with color, character, and care.',
    image: '/images/carousel/carousel-vibrant-collection.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.49.14_PM.jpg',
    alt: 'Vibrant Jute Bag & Gift Collection',
    ctaPrimary: 'Shop Gift Collection',
    ctaSecondary: 'Explore Collections',
    categoryTarget: '',
    objectPosition: 'center right',
    mobileObjectPosition: '75% center',
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Handle document tab visibility to pause auto-rotation
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Autoplay rotation (7 seconds), paused on hover, keyboard focus, or hidden tab
  useEffect(() => {
    if (isHovered || isFocused || isDocumentHidden) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered, isFocused, isDocumentHidden, handleNext]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* 1. Full-Bleed Editorial Hero Container */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div
          role="region"
          aria-label="Homepage Hero Carousel"
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden isolation-isolate min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex items-center shadow-lg border border-[#E7DFD2]/60 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsFocused(false);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Images: 100% full-width and full-height coverage behind content */}
          {HERO_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 ${
                reducedMotion
                  ? 'transition-none'
                  : 'transition-opacity duration-1000 ease-in-out'
              } ${currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-hidden={currentSlide !== idx}
            >
              <img
                src={getAssetUrl(s.image)}
                alt={s.alt}
                onError={(e) => {
                  if (s.fallbackImage && e.currentTarget.src !== s.fallbackImage) {
                    e.currentTarget.src = s.fallbackImage;
                  }
                }}
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  objectPosition: s.objectPosition,
                }}
              />
            </div>
          ))}

          {/* Adaptive Readability Gradient Overlay */}
          {/* Desktop/Tablet Horizontal Gradient: Warm ivory text area on left smoothly fading to transparent over the bags on right */}
          <div
            className="hidden sm:block absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(90deg, rgba(248, 244, 236, 0.97) 0%, rgba(248, 244, 236, 0.90) 36%, rgba(248, 244, 236, 0.55) 56%, rgba(248, 244, 236, 0.08) 78%, transparent 100%)',
            }}
          />

          {/* Mobile Vertical Gradient: Keeps headline and buttons completely readable while showcasing the bag details */}
          <div
            className="sm:hidden absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(180deg, rgba(248, 244, 236, 0.97) 0%, rgba(248, 244, 236, 0.92) 55%, rgba(248, 244, 236, 0.50) 80%, rgba(248, 244, 236, 0.15) 100%)',
            }}
          />

          {/* Content Overlay Layer: Left-aligned editorial text and dual CTAs */}
          <div className="relative z-10 w-full px-5 sm:px-10 md:px-14 lg:px-16 py-10 sm:py-14 lg:py-16 flex flex-col justify-center">
            <div className="max-w-[560px]">
              
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDD7CC] shadow-2xs">
                <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-widest text-[#244536]">
                  {slide.eyebrow}
                </span>
              </div>

              {/* Editorial Serif Headline */}
              <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px] font-bold text-[#1F1A17] leading-[1.14] tracking-tight mt-4 sm:mt-5 whitespace-pre-line">
                {slide.headline}
              </h1>

              {/* Subheading Description */}
              <p className="font-sans text-sm sm:text-base lg:text-[16.5px] text-[#4E433A] leading-relaxed max-w-lg mt-3 sm:mt-4">
                {slide.description}
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  id="hero-primary-cta"
                  onClick={() => onNavigate('products', slide.categoryTarget)}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#244536] hover:bg-[#1B362A] text-[#F8F4EC] font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer group"
                >
                  <span>{slide.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  id="hero-secondary-cta"
                  onClick={() => onNavigate('products')}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-full border border-[#2E251F]/35 hover:border-[#2E251F] bg-white/40 hover:bg-white/70 backdrop-blur-xs text-[#2E251F] font-medium text-xs sm:text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center"
                >
                  <span>{slide.ctaSecondary}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Controls (Over image near bottom-right corner) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D5] text-[#2E251F] shadow-sm select-none">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold tracking-wider font-sans px-1">
              {currentSlide + 1} / {HERO_SLIDES.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Trust Badges Strip (4 columns with clean vertical dividers) */}
      <div className="w-full bg-[#FAF8F5] border-y border-[#E8E2D6] mt-6 sm:mt-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#E8E2D6]">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center space-x-3.5 lg:px-6">
                <div className="shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.6] text-[#244536]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-[14px] font-bold text-[#1F1A17] leading-tight">
                    {title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#55665B] mt-0.5 leading-snug">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
