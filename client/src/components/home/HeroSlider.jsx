import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Truck, Leaf, HandHeart } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetHelper';

const HERO_SLIDES = [
  {
    id: 1,
    badge: 'HANDCRAFTED • ECO-FRIENDLY',
    headline: 'A little piece\nof nature, woven\ninto every day.',
    description: 'Beautifully handcrafted jute bags and home essentials that bring together tradition, nature and modern living.',
    image: '/images/carousel/carousel-floral-bags.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.52.38_PM.jpg',
    alt: 'Handcrafted Floral Jute Bags',
    ctaPrimary: 'Shop Floral Jute Bags',
    categoryTarget: '',
  },
  {
    id: 2,
    badge: 'HANDCRAFTED • EMBELLISHED JUTE',
    headline: 'A little piece\nof nature, woven\ninto every day.',
    description: 'Rustic textures, colorful details, and thoughtful craftsmanship come together in charming handmade pouches and keychains.',
    image: '/images/carousel/carousel-pouches.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.54.45_PM.jpg',
    alt: 'Handcrafted Embellished Jute Pouches',
    ctaPrimary: 'Explore Handmade Pouches',
    categoryTarget: 'pouch',
  },
  {
    id: 3,
    badge: 'SLOW CRAFT • ARTISAN HERITAGE',
    headline: 'A little piece\nof nature, woven\ninto every day.',
    description: 'A colorful collection of handcrafted jute bags featuring elegant trims, embroidery, floral accents, and thoughtful gift designs.',
    image: '/images/carousel/carousel-vibrant-collection.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.49.14_PM.jpg',
    alt: 'Vibrant Jute Bag Collection',
    ctaPrimary: 'Browse Vibrant Collection',
    categoryTarget: '',
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

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="w-full bg-[#FAF8F5] pt-4 sm:pt-8 md:pt-12">
      {/* 1. Main Hero Container (Two-column layout matching reference design) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          
          {/* Left Column: Brand Content, Headline, Subtitle, and Pill Buttons */}
          <div className="w-full lg:w-[52%] flex flex-col items-start text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD7CC] shadow-2xs">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#163323]">
                {slide.badge}
              </span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-bold text-[#163323] leading-[1.14] tracking-tight mt-4 sm:mt-5 whitespace-pre-line">
              {slide.headline}
            </h1>

            {/* Subheading / Description */}
            <p className="font-sans text-sm sm:text-base lg:text-[17px] text-[#55665B] leading-relaxed max-w-lg mt-3 sm:mt-4">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                id="hero-primary-cta"
                onClick={() => onNavigate('products', slide.categoryTarget)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#163323] hover:bg-[#204430] text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer group"
              >
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#163323]/50 hover:border-[#163323] bg-transparent hover:bg-[#163323]/5 text-[#163323] font-medium text-xs sm:text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center"
              >
                <span>Explore Collections</span>
              </button>
            </div>
          </div>

          {/* Right Column: Framed Image Showcase Card with Carousel Controls */}
          <div
            className="w-full lg:w-[48%] flex justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[460px] rounded-3xl overflow-hidden shadow-lg border border-[#E8E2D5] bg-[#F2EDE4] group">
              {HERO_SLIDES.map((s, idx) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={getAssetUrl(s.image)}
                    alt={s.alt}
                    onError={(e) => {
                      if (s.fallbackImage && e.currentTarget.src !== s.fallbackImage) {
                        e.currentTarget.src = s.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}

              {/* Bottom-right slide pagination controls matching reference image */}
              <div className="absolute bottom-3.5 right-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D5] text-[#163323] shadow-sm select-none">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold tracking-wider font-sans px-1">
                  {currentSlide + 1} / {HERO_SLIDES.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Trust Badges Strip (4 columns with vertical dividers matching reference design) */}
      <div className="w-full bg-[#FAF8F5] border-y border-[#E8E2D6] mt-8 sm:mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#E8E2D6]">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center space-x-3.5 lg:px-6">
                <div className="shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.6] text-[#163323]" />
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
    </div>
  );
};
