import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight, Award, Star, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'Handmade With Love',
    title: 'Crafted by Hand • Made to Gift',
    description: 'Rustic textures, colorful details, and thoughtful craftsmanship come together in charming handmade pouches and keychains.',
    image: '/images/carousel/carousel-pouches.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.54.45_PM.jpg',
    pattern: '/images/patterns/pattern-swirl-damask.png',
    ctaPrimary: 'Explore Handmade Pouches',
    categoryTarget: '',
    bgGradient: 'from-[#5E103B] via-[#7F1750] to-[#A32067]',
    mobileGradient: 'from-[#5E103B] via-[#5E103B]/60 via-55% to-transparent',
    mobileBase: '#5E103B',
    accentGlow: 'bg-[#D91680]/30',
    tagBg: 'bg-[#FFF0F7] text-[#9D125A] border-[#FCE7F3]',
    decorBadge: 'Handcrafted Heritage',
  },
  {
    id: 2,
    tagline: 'Botanical & Traditional Charm',
    title: 'Handcrafted Floral Jute Bags',
    description: 'Beautiful eco-friendly jute bags adorned with vibrant floral embroidery, bringing together natural texture and traditional handmade charm.',
    image: '/images/carousel/carousel-floral-bags.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.52.38_PM.jpg',
    pattern: '/images/patterns/pattern-paisley-kalamkari.jpg',
    ctaPrimary: 'Shop Floral Jute Bags',
    categoryTarget: '',
    bgGradient: 'from-[#6E2E0A] via-[#924011] to-[#BD591D]',
    mobileGradient: 'from-[#6E2E0A] via-[#6E2E0A]/60 via-55% to-transparent',
    mobileBase: '#6E2E0A',
    accentGlow: 'bg-[#F59E0B]/30',
    tagBg: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
    decorBadge: 'Festive & Eco-Friendly',
  },
  {
    id: 3,
    tagline: 'Artisan Heritage Collection',
    title: 'Vibrant Jute Bag Collection',
    description: 'A colorful collection of handcrafted jute bags featuring elegant trims, embroidery, floral accents, and thoughtful gift designs.',
    image: '/images/carousel/carousel-vibrant-collection.jpg',
    fallbackImage: 'https://res.cloudinary.com/u1jnbrwg/image/upload/v1789142235/WhatsApp_Image_2026-09-08_at_12.49.14_PM.jpg',
    pattern: '/images/patterns/pattern-botanical-blockprint.png',
    ctaPrimary: 'Browse Vibrant Collection',
    categoryTarget: '',
    bgGradient: 'from-[#173D21] via-[#215730] to-[#2E7844]',
    mobileGradient: 'from-[#173D21] via-[#173D21]/60 via-55% to-transparent',
    mobileBase: '#173D21',
    accentGlow: 'bg-[#10B981]/30',
    tagBg: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
    decorBadge: 'Slow Craft Artisan',
  },
];

export const HeroSlider = ({ onNavigate }) => {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleBulkInquiry = () => {
    const msg = buildWhatsAppInquiryMessage('custom-bulk');
    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-4">
      {/* 1. Hero Slide Banner (Compact on Mobile, Side-by-Side on Desktop) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 h-[92vw] max-h-[520px] sm:h-[440px] sm:max-h-[520px] lg:h-auto lg:max-h-none lg:min-h-[460px]">
        
        {/* Mobile Background: Full product image across entire card */}
        <div className="lg:hidden absolute inset-0">
          {HERO_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Full-card product image — completely unobscured */}
              <img
                src={getAssetUrl(s.image)}
                alt={s.title}
                onError={(e) => {
                  if (s.fallbackImage && e.currentTarget.src !== s.fallbackImage) {
                    e.currentTarget.src = s.fallbackImage;
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Only a gentle gradient at the very bottom behind the text — image stays fully visible */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[52%] pointer-events-none"
                style={{ background: `linear-gradient(to top, ${s.mobileBase}F0 0%, ${s.mobileBase}CC 30%, ${s.mobileBase}60 60%, transparent 100%)` }}
              />
            </div>
          ))}
        </div>

        {/* Desktop Background: Vibrant Color Theme + Ambient Glow + Enhanced Pattern Texture */}
        <div className="hidden lg:block absolute inset-0">
          {HERO_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient} transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Repeating Artisan Pattern Texture with Enhanced Opacity on Desktop */}
              {s.pattern && (
                <div
                  className="absolute inset-0 opacity-28 mix-blend-overlay pointer-events-none bg-repeat"
                  style={{ backgroundImage: `url(${getAssetUrl(s.pattern)})`, backgroundSize: '320px' }}
                />
              )}
              <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full ${s.accentGlow} blur-3xl opacity-60 pointer-events-none`} />
              <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Banner Inner Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end lg:justify-between lg:flex-row items-stretch lg:items-center p-3.5 sm:p-6 lg:p-10 pb-4 sm:pb-6 gap-2 sm:gap-3 lg:gap-10 lg:min-h-[460px]">
          
          {/* Content Column: Text & Dual CTAs */}
          <div className="w-full lg:w-[55%] flex flex-col justify-end lg:justify-center text-white space-y-1.5 sm:space-y-3 pb-0">
            
            {/* Top Badge */}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border shadow-xs ${slide.tagBg}`}>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{slide.decorBadge}</span>
              </span>
            </div>

            {/* Brand Title */}
            <h1 className="text-[21px] sm:text-3xl md:text-4xl lg:text-[48px] font-brand-script font-bold text-white tracking-wide leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Countryside Craft
            </h1>

            {/* Tagline */}
            <h2 className="text-[14.5px] sm:text-xl lg:text-2xl font-serif-display font-bold text-[#FDF0A6] leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {slide.tagline}
            </h2>

            {/* Product Subtitle */}
            <p className="text-[11.5px] sm:text-base lg:text-lg font-medium text-white leading-snug font-serif-display drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {slide.title}
            </p>

            {/* Description */}
            <p className="text-white text-[10.5px] sm:text-xs md:text-sm lg:text-base leading-relaxed max-w-xl font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] line-clamp-2 sm:line-clamp-none">
              {slide.description}
            </p>

            {/* Dual CTAs: Primary Pink + Secondary Emerald WhatsApp */}
            <div className="pt-1.5 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
              <button
                id="hero-primary-cta"
                onClick={() => onNavigate('products', slide.categoryTarget)}
                className="w-full sm:w-auto h-9 sm:h-11 py-2 px-4 sm:px-6 rounded-full bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer border border-[#EFC0DA]/50"
              >
                <span>{slide.ctaPrimary || 'Explore Collection'} →</span>
              </button>

              <button
                id="hero-whatsapp-inquiry-cta"
                onClick={handleBulkInquiry}
                className="w-full sm:w-auto h-9 sm:h-11 py-2 px-3.5 sm:px-5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer border border-[#6EE7B7]/50"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span>Inquire for Custom &amp; Bulk Favors</span>
              </button>
            </div>
          </div>

          {/* Right Column (Desktop Only): Full Crisp Product Showcase Image */}
          <div className="hidden lg:flex w-[45%] items-center justify-center mb-4">
            <div className="relative w-full aspect-square max-h-[365px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40 bg-white/10 backdrop-blur-xs group">
              {HERO_SLIDES.map((s, idx) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={getAssetUrl(s.image)}
                    alt={s.title}
                    onError={(e) => {
                      if (s.fallbackImage && e.currentTarget.src !== s.fallbackImage) {
                        e.currentTarget.src = s.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover object-center rounded-3xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Carousel Navigation Controls (Mini, placed cleanly at bottom-right on desktop without overlapping carousel) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-4 lg:top-auto lg:bottom-2.5 lg:right-6 z-20 flex items-center space-x-1 sm:space-x-1.5">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="p-1 sm:p-1.5 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === i ? 'w-3 sm:w-4 bg-[#FDF0A6]' : 'w-1 sm:w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="p-1 sm:p-1.5 rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>

      {/* 2. Trust Micro-Grid (2x2 on Mobile, 4-col on Desktop) */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white border border-[#EADDC6]/70 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-7xl mx-auto">
          {[
            { icon: '⭐', bg: 'bg-[#FDF2F8] text-[#BE185D]', title: '5,000+ Totes', sub: 'Small batch craft' },
            { icon: '★', bg: 'bg-[#FEF3C7] text-[#B45309]', title: '4.9★ Rating', sub: 'Verified buyers' },
            { icon: '🚚', bg: 'bg-[#EFF6FF] text-[#1D4ED8]', title: '48-Hr Dispatch', sub: 'Pan-India delivery' },
            { icon: '🌿', bg: 'bg-[#ECFDF5] text-[#047857]', title: 'Eco Cotton', sub: 'Zero-plastic pack' },
          ].map(({ icon, bg, title, sub }) => (
            <div
              key={title}
              className="flex items-center space-x-2.5 sm:space-x-3.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FAF7F2] border border-[#F1E9DF] hover:border-[#D91680]/30 transition-all hover:bg-white shadow-2xs"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${bg} flex items-center justify-center text-sm sm:text-base shrink-0 shadow-2xs`}>
                <span>{icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] sm:text-[13px] font-bold text-[#1A1F2C] truncate leading-tight">{title}</p>
                <p className="text-[11px] sm:text-xs text-[#6A5E54] truncate mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
