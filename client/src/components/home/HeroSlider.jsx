import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Star, Truck, Leaf, HandHeart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

const HERO_SLIDES = [
  {
    id: 1,
    decorBadge: 'Slow Craft Artisan',
    brandTitle: 'Countryside Craft',
    tagline: 'Artisan Heritage Collection',
    title: 'Vibrant Jute Bag Collection',
    description: 'A colorful collection of handcrafted jute bags featuring elegant trims, embroidery, floral accents, and thoughtful gift designs.',
    image: '/images/carousel/carousel-vibrant-collection.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.49.14_PM.jpg',
    alt: 'Vibrant Jute Bag Collection',
    ctaPrimary: 'Browse Vibrant Collection',
    categoryTarget: '',
    bgGradient: 'from-[#143522] via-[#1B462C] to-[#25613D]',
    pattern: '/images/patterns/pattern-botanical-blockprint.png',
    accentGlow: 'bg-[#10B981]/30',
    taglineColor: 'text-[#FDF0A6]',
  },
  {
    id: 2,
    decorBadge: 'Festive & Eco-Friendly',
    brandTitle: 'Countryside Craft',
    tagline: 'Botanical & Traditional Charm',
    title: 'Handcrafted Floral Jute Bags',
    description: 'Beautiful eco-friendly jute bags adorned with vibrant floral embroidery, bringing together natural texture and traditional handmade charm.',
    image: '/images/carousel/carousel-floral-bags.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.52.38_PM.jpg',
    alt: 'Handcrafted Floral Jute Bags',
    ctaPrimary: 'Shop Floral Jute Bags',
    categoryTarget: '',
    bgGradient: 'from-[#163326] via-[#1F4936] to-[#2B664B]',
    pattern: '/images/patterns/pattern-paisley-kalamkari.jpg',
    accentGlow: 'bg-[#FBBF24]/25',
    taglineColor: 'text-[#FEF08A]',
  },
  {
    id: 3,
    decorBadge: 'Handcrafted Heritage',
    brandTitle: 'Countryside Craft',
    tagline: 'Handmade With Love',
    title: 'Crafted by Hand • Made to Gift',
    description: 'Rustic textures, colorful details, and thoughtful craftsmanship come together in charming handmade pouches and keychains.',
    image: '/images/carousel/carousel-pouches.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.54.45_PM.jpg',
    alt: 'Handcrafted Embellished Jute Pouches',
    ctaPrimary: 'Explore Handmade Pouches',
    categoryTarget: 'pouch',
    bgGradient: 'from-[#422213] via-[#5C301A] to-[#783E20]',
    pattern: '/images/patterns/pattern-swirl-damask.png',
    accentGlow: 'bg-[#F97316]/25',
    taglineColor: 'text-[#FED7AA]',
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

  const handleBulkInquiry = () => {
    const msg = buildWhatsAppInquiryMessage('custom-bulk');
    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {/* 1. Main Hero Container with Rich Botanical Color Palette, Pattern Texture & Ambient Lighting */}
      <div className="relative w-full overflow-hidden transition-all duration-1000 ease-in-out">
        {/* Dynamic Background Gradients & Artisan Pattern Overlays */}
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient} transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Repeating Botanical Blockprint Pattern Texture */}
            {s.pattern && (
              <div
                className="absolute inset-0 opacity-22 mix-blend-overlay pointer-events-none bg-repeat"
                style={{ backgroundImage: `url(${getAssetUrl(s.pattern)})`, backgroundSize: '320px' }}
              />
            )}
            {/* Ambient Radial Glow Lighting */}
            <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full ${s.accentGlow} blur-3xl opacity-60 pointer-events-none`} />
            <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
          </div>
        ))}

        {/* Hero Inner Content (Two-Column Layout) */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14">
            
            {/* Left Column: Brand Content, Tagline, Subtitle, and Dual CTAs */}
            <div className="w-full lg:w-[52%] flex flex-col items-start text-left">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FDF0A6]" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  {slide.decorBadge}
                </span>
              </div>

              {/* Brand Title (Script Display with Glow) */}
              <div className="mt-3 sm:mt-4">
                <span className="font-brand-script font-bold text-3xl sm:text-4xl lg:text-[50px] text-white tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                  Countryside Craft
                </span>
              </div>

              {/* Tagline */}
              <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif-display font-bold ${slide.taglineColor} leading-snug mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}>
                {slide.tagline}
              </h1>

              {/* Product Title / Subtitle */}
              <h2 className="text-base sm:text-lg md:text-xl font-serif-display font-semibold text-white/95 mt-1 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                {slide.title}
              </h2>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm md:text-base text-white/85 leading-relaxed max-w-lg mt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                {slide.description}
              </p>

              {/* Dual CTAs: Primary Storefront CTA + WhatsApp Bulk Inquiry */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  id="hero-primary-cta"
                  onClick={() => onNavigate('products', slide.categoryTarget)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0E2318] hover:bg-[#163323] text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-[#C6A46A]/50 transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 group"
                >
                  <span>{slide.ctaPrimary} →</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  id="hero-whatsapp-inquiry-cta"
                  onClick={handleBulkInquiry}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#10B981]/25 transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <span>Inquire for Custom &amp; Bulk Favors</span>
                </button>
              </div>
            </div>

            {/* Right Column: Framed Image Showcase Card with Carousel Controls */}
            <div
              className="w-full lg:w-[48%] flex justify-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[460px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black/20 group">
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

                {/* Bottom-right slide pagination controls with frosted glass backdrop */}
                <div className="absolute bottom-3.5 right-4 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/25 text-white shadow-md select-none">
                  <button
                    onClick={handlePrev}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold tracking-wider font-sans px-1">
                    {currentSlide + 1} / {HERO_SLIDES.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Trust Badges Strip (4 columns with clean vertical dividers) */}
      <div className="w-full bg-[#F8F5EF] border-y border-[#E7DFD2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x divide-[#E7DFD2]">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center space-x-3.5 lg:px-6">
                <div className="shrink-0 p-2 rounded-xl bg-white border border-[#E7DFD2] shadow-2xs">
                  <Icon className="w-5 h-5 stroke-[1.8] text-[#163323]" />
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
