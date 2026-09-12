import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

interface HeroSliderProps {
  onNavigate: (view: string, param?: string) => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'Handcrafted Heritage • Slow Living',
    title: 'Wearable Art on Heavyweight Organic Canvas',
    description: 'Discover authentic Bagru Dabu mud-resist block prints, botanical marigolds, and heirloom tote bags crafted in small artisan batches in India.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85',
    ctaPrimary: 'Explore Best Selling Totes',
    categoryTarget: '',
    accent: 'from-[#1C1814]/90 via-[#2A231C]/75 to-transparent'
  },
  {
    id: 2,
    tagline: 'Festive & Wedding Favors',
    title: 'Custom Gilded Return Gift Totes For Your Celebrations',
    description: 'Elevate your Indian wedding hampers, corporate gifting, and festive celebrations with customized monograms, zari borders, and silk-touch cotton linings.',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1400&q=85',
    ctaPrimary: 'Shop Festive Collections',
    categoryTarget: 'festive-wedding',
    accent: 'from-[#241A14]/90 via-[#36231A]/75 to-transparent'
  },
  {
    id: 3,
    tagline: 'Botanical & Eco Canvas',
    title: 'Pressed Florals & Untreated Natural Canvas Totes',
    description: 'Designed for daily office commutes, weekend farmers markets, and book lovers. Double-stitched handles tested to carry 14+ kg effortlessly.',
    image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1400&q=85',
    ctaPrimary: 'Browse Botanical Prints',
    categoryTarget: 'botanical-floral',
    accent: 'from-[#18201B]/90 via-[#222E26]/75 to-transparent'
  }
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { settings } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleBulkInquiry = () => {
    const msg = buildWhatsAppInquiryMessage('custom-bulk');
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden bg-[#24201B] text-white min-h-[540px] md:min-h-[620px] flex items-center">
      {/* Background Slides */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.accent}`} />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 z-10 w-full">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.tagline}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-display font-bold text-[#FAF7F0] leading-[1.15] tracking-tight">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-[#E3DACB] leading-relaxed max-w-xl font-normal">
            {slide.description}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              id="hero-primary-cta"
              onClick={() => onNavigate('products', slide.categoryTarget)}
              className="py-3.5 px-6 rounded-xl bg-[#FAF6EE] text-[#241F18] font-bold text-sm hover:bg-[#EADDC6] shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>{slide.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 text-[#8C5E3C]" />
            </button>

            <button
              id="hero-whatsapp-inquiry-cta"
              onClick={handleBulkInquiry}
              className="py-3.5 px-5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-sm backdrop-blur-md border border-emerald-500/40 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Custom Bulk / Wedding Inquiries</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#D8CEBC]">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>450 GSM Heavy Canvas</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>AZO-Free Natural Inks</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>WhatsApp Checkout</span>
            </span>
          </div>

        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2">
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex space-x-1.5 px-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-6 bg-amber-300' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
