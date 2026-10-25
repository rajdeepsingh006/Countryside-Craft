import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Play,
  Heart,
  Share2,
  Package,
  Layers,
  ArrowRight,
  MessageSquare,
  FileText,
  Ruler,
  Droplets,
  Gift,
  ArrowDown,
  ZoomIn,
  X,
  Maximize2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ProductCard } from '../components/product/ProductCard';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';
import { reviewService } from '../services/reviewService';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { VideoThumbnail } from '../components/common/VideoThumbnail';
import { parseVideoUrl, isVideoUrl, getVideoThumbnail } from '../utils/videoHelpers';
import { getAssetUrl } from '../utils/assetHelper';

export const ProductDetailPage = ({ slug, onNavigate }) => {
  const { products, reviews, settings, openReviewModal, showToast } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug || p._id === slug) || products[0];

  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [localReviews, setLocalReviews] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    desc: true,     // Description & Craft Story (open by default)
    specs: false,   // Dimensions & Specifications
    care: false,    // Care & Wash Guidelines
    reviews: false, // Customer Reviews
    gifting: false, // Bulk & Wedding Gifting
    similar: true,  // Similar Designs
  });

  // Unified media gallery including photos and showcase videos
  const mediaList = useMemo(() => {
    if (!product) return [];
    const list = [];
    const seen = new Set();

    // 1. Process all items in product.images (detect whether image or video)
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((url, idx) => {
        if (!url || typeof url !== 'string' || !url.trim()) return;
        const trimmed = url.trim();
        if (seen.has(trimmed)) return;
        seen.add(trimmed);

        if (isVideoUrl(trimmed)) {
          const parsed = parseVideoUrl(trimmed);
          const poster = (product.videoThumbnail && getAssetUrl(product.videoThumbnail.trim())) || getVideoThumbnail(trimmed) || '';
          list.push({
            type: 'video',
            url: trimmed,
            parsed,
            poster,
            id: `video-item-${idx}`,
          });
        } else {
          list.push({
            type: 'image',
            url: getAssetUrl(trimmed),
            id: `img-${idx}`,
          });
        }
      });
    }

    // 2. Process explicit product.video if provided and not already included
    if (product.video && typeof product.video === 'string' && product.video.trim()) {
      const trimmed = product.video.trim();
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        const parsed = parseVideoUrl(trimmed);
        const poster = (product.videoThumbnail && getAssetUrl(product.videoThumbnail.trim())) || getVideoThumbnail(trimmed) || '';
        list.push({
          type: 'video',
          url: trimmed,
          parsed,
          poster,
          id: 'video-main',
        });
      }
    }

    // Fallback if product has no images: fallback to image field
    if (list.length === 0 && product.image) {
      list.push({
        type: 'image',
        url: getAssetUrl(product.image),
        id: 'img-main',
      });
    }

    return list;
  }, [product]);

  const activeVideo = mediaList.find((m) => m.type === 'video') || (product?.video ? { url: product.video, poster: product.videoThumbnail ? getAssetUrl(product.videoThumbnail) : '' } : null);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openAndScrollToSection = (key, elementId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: true,
    }));
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setActiveMediaIdx((prev) => (prev > 0 ? prev - 1 : Math.max(0, mediaList.length - 1)));
      }
      if (e.key === 'ArrowRight') {
        setActiveMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, mediaList.length]);

  useEffect(() => {
    setActiveMediaIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (product?._id) {
      reviewService.getReviews(product._id).then((res) => {
        const fetched = res.reviews || (Array.isArray(res) ? res : []);
        setLocalReviews(fetched);
      }).catch(() => {});
    }
  }, [slug, product?._id]);

  if (!product) {
    return (
      <div className="py-20 text-center bg-[#FCFBFA]">
        <h2 className="text-xl font-bold text-[#1A1F2C]">Product not found</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 px-6 py-2.5 bg-[#D91680] text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Combine global store reviews and locally fetched reviews
  const productReviews = [
    ...localReviews,
    ...reviews.filter(
      (r) =>
        (r.productId === product._id ||
          r.product === product._id ||
          r.product?._id === product._id) &&
        r.isApproved !== false &&
        !localReviews.some((lr) => lr._id === r._id)
    ),
  ];

  const relatedProducts = products
    .filter(
      (p) =>
        p.isActive &&
        p._id !== product._id &&
        ((p.category?.slug || p.category) === (product.category?.slug || product.category) ||
          p.isBestseller)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectWhatsAppBuy = () => {
    const msg = `Namaste Countryside Craft Team! 👋 I would like to order "${product.name}" (Qty: ${quantity}, Price: ${formatCurrency(
      product.price * quantity
    )}). Could you please share delivery timeframe and payment details?`;
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline || product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] py-2 sm:py-4 pb-44 sm:pb-36 md:pb-24 selection:bg-[#244537] selection:text-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Hierarchy */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#6D756D] mb-2 overflow-x-auto no-scrollbar py-0.5">
          <button onClick={() => onNavigate('home')} className="hover:text-[#244537] shrink-0 cursor-pointer font-medium">
            Home
          </button>
          <span className="text-[#E7DFD2]">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-[#244537] shrink-0 cursor-pointer font-medium">
            All Totes
          </button>
          <span className="text-[#E7DFD2]">/</span>
          <button
            onClick={() => onNavigate('products', product.categorySlug || product.category?.slug || product.category)}
            className="hover:text-[#244537] shrink-0 cursor-pointer"
          >
            {product.categoryName || product.category?.name || product.category}
          </button>
          <span className="text-[#E7DFD2]">/</span>
          <span className="text-[#193428] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product View: Gallery (6 cols) + Product Details (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-[#EAE4DC] shadow-2xs items-start texture-canvas">
          
          {/* Image & Video Gallery Left (6 cols) */}
          <div className="lg:col-span-6 space-y-2.5">
            
            {/* Primary Main Image / Video View with Constrained Height & Framed Fit */}
            {mediaList.length > 0 ? (
              (() => {
                const currentMedia = mediaList[activeMediaIdx] || mediaList[0];
                const isVideo = currentMedia?.type === 'video';

                return (
                  <div
                    onClick={() => {
                      if (!isVideo) setIsLightboxOpen(true);
                    }}
                    className={`relative aspect-[16/11] max-h-[360px] sm:max-h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-[#EAE4DC] shadow-2xs group flex items-center justify-center ${
                      isVideo ? 'bg-black' : 'bg-[#F8F6F2] cursor-zoom-in'
                    }`}
                  >
                    {isVideo ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoPlayer
                          url={currentMedia.url}
                          poster={currentMedia.poster}
                          className="w-full h-full object-cover"
                          autoPlay={activeMediaIdx !== 0 || !mediaList.some((m) => m.type === 'image')}
                          controls={true}
                        />
                      </div>
                    ) : (
                      <>
                        <img
                          src={currentMedia.url}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 scale-125 pointer-events-none"
                        />
                        <img
                          src={currentMedia.url}
                          alt={product.name}
                          className="relative z-1 w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                        />
                      </>
                    )}

                    {/* Left and Right Nav Buttons if multiple media items */}
                    {mediaList.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] hover:text-[#D91680] shadow-md flex items-center justify-center transition-all hover:scale-110 z-20 cursor-pointer border border-[#B9C9E7]/40"
                          aria-label="Previous media"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] hover:text-[#D91680] shadow-md flex items-center justify-center transition-all hover:scale-110 z-20 cursor-pointer border border-[#B9C9E7]/40"
                          aria-label="Next media"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                      {isVideo && (
                        <span className="bg-[#1A1F2C]/90 text-[#DBE586] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md border border-white/40 flex items-center gap-1.5 backdrop-blur-sm">
                          <Play className="w-3 h-3 fill-[#DBE586]" /> SHOWCASE VIDEO
                        </span>
                      )}
                      {product.discountPercent > 0 && (
                        <span className="bg-[#EFC0DA] text-[#86124F] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md border border-white">
                          {product.discountPercent}% OFF
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="bg-[#DBE586] text-[#343C05] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md border border-white">
                          ★ Bestseller
                        </span>
                      )}
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                      {activeVideo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVideoModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-full bg-[#141926]/90 hover:bg-[#141926] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 border border-white/30 cursor-pointer"
                          title="Open Video Theater"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-[#DBE586]" />
                        </button>
                      )}
                      {!isVideo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLightboxOpen(true);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] hover:text-[#D91680] flex items-center justify-center shadow-md transition-all hover:scale-105 border border-[#B9C9E7]/40 cursor-pointer"
                          title="Fullscreen Zoom"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                        className="p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] shadow-md transition-transform hover:scale-110 cursor-pointer"
                        title="Share product"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stock Notice */}
                    {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute bottom-3 left-3 bg-[#1A1F2C]/90 text-[#DBE586] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow pointer-events-none">
                        🔥 Only {product.stock} units left in stock!
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="relative aspect-[16/11] max-h-[340px] sm:max-h-[370px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F6EFE5] to-[#EAE0D2] border border-[#EADBCE] shadow-2xs flex flex-col items-center justify-center p-6 text-center select-none">
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.discountPercent > 0 && (
                    <span className="bg-[#EFC0DA] text-[#86124F] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md border border-white">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-[#DBE586] text-[#343C05] text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md border border-white">
                      ★ Bestseller
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Share product"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/85 shadow-sm border border-[#E6D8C8] flex items-center justify-center text-[#D91680] mb-3">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#D91680]" />
                </div>
                <h4 className="font-brand-script text-2xl sm:text-3xl text-[#1A1F2C] leading-none">
                  Countryside Craft
                </h4>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#8A7A6C] mt-1">
                  Artisan Handcrafted Original
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#A69485] bg-white/80 px-3 py-1 rounded-full border border-[#EADBCE] font-medium shadow-2xs">
                    🌿 100% Handcrafted
                  </span>
                  <span className="text-[10px] text-[#A69485] bg-white/80 px-3 py-1 rounded-full border border-[#EADBCE] font-medium shadow-2xs">
                    ✨ Small Batch
                  </span>
                </div>
              </div>
            )}

            {/* Thumbnail Strip */}
            {mediaList.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                {mediaList.map((item, i) => (
                  <button
                    key={item.id || i}
                    onClick={() => setActiveMediaIdx(i)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer p-0.5 relative ${
                      activeMediaIdx === i
                        ? 'border-[#D91680] scale-105 shadow-md ring-2 ring-[#D91680]/25'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <VideoThumbnail
                        videoUrl={item.url}
                        posterUrl={item.poster}
                        isActive={activeMediaIdx === i}
                        showBadge={true}
                        badgeText="VIDEO"
                        playIconSize="sm"
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={`Media thumbnail ${i + 1}`}
                        className="w-full h-full object-contain rounded-lg bg-[#F8F6F2]"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Product Details & Ordering Right (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3.5">
            
            <div className="space-y-2">
              {/* Category & Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1E3A8A] bg-[#EEF3FA] px-2.5 py-0.5 rounded-full border border-[#B9C9E7] shadow-2xs">
                  {product.categoryName || product.category?.name || product.category}
                </span>
                {product.isBestseller && (
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#343C05] bg-[#DBE586] px-2.5 py-0.5 rounded-full shadow-2xs">
                    ★ Bestseller
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif-display font-black text-[#1A1F2C] leading-snug">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-xs sm:text-sm text-[#5C677D] font-serif-display italic">
                  "{product.tagline}"
                </p>
              )}

              {/* Rating & Review Jump */}
              <div className="flex items-center space-x-2 pt-0.5 text-xs sm:text-sm">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.ratingAverage || 0)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs sm:text-sm font-black text-[#1A1F2C] ml-1">
                    {product.ratingAverage || 0}
                  </span>
                </div>
                <span
                  className="text-xs sm:text-sm text-[#D91680] font-bold underline cursor-pointer hover:text-[#BE0E6E]"
                  onClick={() => openAndScrollToSection('reviews', 'product-reviews-accordion')}
                >
                  ({productReviews.length} reviews)
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700">• Ready to Dispatch</span>
              </div>

              {/* Price & Savings */}
              <div className="pt-1.5 border-t border-[#EEF3FA]">
                <div className="flex items-baseline space-x-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#1A1F2C]">
                    {formatCurrency(product.price)}
                  </span>
                  {(() => {
                    const displayOriginalPrice =
                      product.originalPrice && product.originalPrice > product.price
                        ? product.originalPrice
                        : product.discountPercent > 0
                        ? Math.round(product.price / (1 - product.discountPercent / 100))
                        : null;

                    if (!displayOriginalPrice || displayOriginalPrice <= product.price) return null;
                    return (
                      <>
                        <span className="text-sm sm:text-base text-[#8E9DBE] line-through">
                          {formatCurrency(displayOriginalPrice)}
                        </span>
                        <span className="text-xs font-black text-[#86124F] bg-[#EFC0DA] px-2 py-0.5 rounded-full border border-white">
                          Save {formatCurrency(displayOriginalPrice - product.price)}
                        </span>
                      </>
                    );
                  })()}
                </div>
                {/* 2x2 Value Propositions Micro-Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-[#F1E9DF] mt-2">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D91680] shadow-2xs border border-[#EFE8DC]">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold text-[#1A1F2C]">Free Shipping</span>
                      <span className="text-[10px] sm:text-[11px] text-[#6A5E54] truncate">Orders over ₹999</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-[#006C49] shadow-2xs border border-[#EFE8DC]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold text-[#1A1F2C]">Holds 12+ kg</span>
                      <span className="text-[10px] sm:text-[11px] text-[#6A5E54] truncate">Cross-box stitch</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-amber-600 shadow-2xs border border-[#EFE8DC]">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold text-[#1A1F2C]">100% Cotton</span>
                      <span className="text-[10px] sm:text-[11px] text-[#6A5E54] truncate">450 GSM Heavy</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D91680] shadow-2xs border border-[#EFE8DC]">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold text-[#1A1F2C]">Zero-Plastic</span>
                      <span className="text-[10px] sm:text-[11px] text-[#6A5E54] truncate">Eco packaging</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="py-1 space-y-1 text-xs sm:text-sm text-[#2D3748]">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#D91680]">Material:</span>
                  <span>{product.material || '450 GSM Heavy Organic Cotton Canvas'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#D91680]">Dimensions:</span>
                  <span>{product.dimensions || '16" H x 15" W x 4" Gusset'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#D91680]">Closure:</span>
                  <span>{product.closureType || 'Zipper + Magnetic Snap'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Consolidated Stacked Accordion Panels */}
        <div id="product-details-accordion" className="mt-8 space-y-3">
          
          {/* Accordion 1: Description & Craft Story */}
          <div className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
            <button
              type="button"
              id="accordion-desc-btn"
              onClick={() => toggleSection('desc')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FDF1F7] text-[#D91680] flex items-center justify-center shrink-0 border border-[#EFC0DA]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                    Description & Craft Story
                  </h3>
                  <p className="text-[11px] text-[#6A758E] hidden sm:block">
                    Artisan heritage, woodblock carving, and natural botanical dyes
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                  expandedSections.desc ? 'rotate-180 text-[#D91680]' : ''
                }`}
              />
            </button>
            {expandedSections.desc && (
              <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60 space-y-4 text-xs sm:text-sm text-[#2D3748] leading-relaxed">
                <p>{product.description}</p>
                {product.detailedStory && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD2] space-y-2">
                    <h4 className="font-serif-display font-bold text-xs sm:text-sm text-[#1A1F2C]">
                      The Artisan Printing Process
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed italic">{product.detailedStory}</p>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#1A1F2C]">
                      Key Features & Handcrafted Highlights:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#2D3748]">
                      {product.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion 2: Dimensions & Specifications */}
          <div className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
            <button
              type="button"
              id="accordion-specs-btn"
              onClick={() => toggleSection('specs')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEF3FA] text-[#1E3A8A] flex items-center justify-center shrink-0 border border-[#B9C9E7]">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                    Dimensions & Specifications
                  </h3>
                  <p className="text-[11px] text-[#6A758E] hidden sm:block">
                    Exact measurements, fabric weight, and hardware details
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                  expandedSections.specs ? 'rotate-180 text-[#D91680]' : ''
                }`}
              />
            </button>
            {expandedSections.specs && (
              <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm text-[#2D3748]">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Canvas Weight & Fabric</span>
                    <span className="text-[#4A5568]">{product.material || '450 GSM Heavy Organic Canvas'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Dimensions</span>
                    <span className="text-[#4A5568]">{product.dimensions || '16" H x 15" W x 4" Bottom Gusset'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Closure & Fasteners</span>
                    <span className="text-[#4A5568]">{product.closureType || 'Antiqued Brass Zipper'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Handle Drop Length</span>
                    <span className="text-[#4A5568]">11.5 inches (Comfortable shoulder carry)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Interior Configuration</span>
                    <span className="text-[#4A5568]">1 Zippered Pocket + 2 Slip Pockets for Phone & Keys</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD2]">
                    <span className="font-bold text-[#1A1F2C] block mb-1">Reinforcement</span>
                    <span className="text-[#4A5568]">Cross-box stitching tested for 12+ kg daily carry</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Materials & Care Guidelines */}
          <div className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
            <button
              type="button"
              id="accordion-care-btn"
              onClick={() => toggleSection('care')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7F9E4] text-[#3D4706] flex items-center justify-center shrink-0 border border-[#DBE586]">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                    Materials & Care Guidelines
                  </h3>
                  <p className="text-[11px] text-[#6A758E] hidden sm:block">
                    Washing, spot cleaning, and preserving natural dye luminosity
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                  expandedSections.care ? 'rotate-180 text-[#D91680]' : ''
                }`}
              />
            </button>
            {expandedSections.care && (
              <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60 space-y-3 text-xs sm:text-sm text-[#2D3748] leading-relaxed">
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#3E475C]">
                  <li>Spot clean gently with cold water and mild eco-friendly or soapnut detergent.</li>
                  <li>Natural vegetable indigo and botanical dyes may crock slightly in initial washes; wash separately from light garments.</li>
                  <li>Do not bleach, machine tumble dry, or dry clean.</li>
                  <li>Hang flat to dry in shaded area to protect natural dye vibrancy from harsh direct sunlight.</li>
                  <li>Warm iron on reverse side if desired.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Accordion 4: Customer Reviews */}
          <div id="product-reviews-accordion" className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
            <button
              type="button"
              id="accordion-reviews-btn"
              onClick={() => toggleSection('reviews')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                    Customer Reviews ({productReviews.length})
                  </h3>
                  <p className="text-[11px] text-[#6A758E] hidden sm:block">
                    Authentic feedback from verified buyers
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                  expandedSections.reviews ? 'rotate-180 text-[#D91680]' : ''
                }`}
              />
            </button>
            {expandedSections.reviews && (
              <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1E9DF] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-[#1A1F2C]">{product.ratingAverage || 5.0}</span>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.ratingAverage || 5)
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#6A758E]">({productReviews.length} reviews)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openReviewModal(product)}
                    className="px-4 py-2 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer border border-[#EFC0DA] active:scale-98 w-fit"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#6A758E]">
                      <p>No reviews yet for this specific design. Be the first to share your thoughts!</p>
                      <button
                        onClick={() => openReviewModal(product)}
                        className="mt-2 text-[#D91680] font-bold underline cursor-pointer text-xs"
                      >
                        Write first review →
                      </button>
                    </div>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev._id} className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-bold text-[#1A1F2C]">{rev.customerName}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                                Verified Buyer
                              </span>
                            )}
                            <span className="text-[11px] text-[#6A758E]">({rev.customerLocation || 'India'})</span>
                          </div>
                          <div className="flex items-center text-amber-500">
                            {[...Array(rev.rating)].map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-[13px] text-[#2D3748] leading-relaxed">"{rev.comment}"</p>
                        <span className="text-[10px] text-[#8E9DBE] block">{formatDate(rev.createdAt)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Accordion 5: Bulk & Wedding Gifting (25+ Units) */}
          <div className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
            <button
              type="button"
              id="accordion-gifting-btn"
              onClick={() => toggleSection('gifting')}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FDF1F7] text-[#D91680] flex items-center justify-center shrink-0 border border-[#EFC0DA]">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                    Bulk & Wedding Gifting (25+ Units)
                  </h3>
                  <p className="text-[11px] text-[#6A758E] hidden sm:block">
                    Custom monograms, gold foil tags, and volume pricing
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                  expandedSections.gifting ? 'rotate-180 text-[#D91680]' : ''
                }`}
              />
            </button>
            {expandedSections.gifting && (
              <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60 space-y-3 text-xs sm:text-sm text-[#2D3748] leading-relaxed">
                <p>
                  Planning an artisanal Indian wedding favor, corporate sustainable hamper, or eco-retreat gift? We offer custom gold foil initials, personalized bride/groom tags, custom colorways, and wholesale volume pricing starting at 25 pieces.
                </p>
                <button
                  onClick={() => {
                    const msg = buildWhatsAppInquiryMessage('custom-bulk', product.name);
                    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank');
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#006C49] hover:bg-[#005a3d] text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer active:scale-98 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire Bulk Pricing on WhatsApp</span>
                </button>
              </div>
            )}
          </div>

          {/* Accordion 6: Similar Handcrafted Designs */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EAE4DC] overflow-hidden shadow-2xs texture-canvas">
              <button
                type="button"
                id="accordion-similar-btn"
                onClick={() => toggleSection('similar')}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF8F5]/80 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EEF3FA] text-[#1E3A8A] flex items-center justify-center shrink-0 border border-[#B9C9E7]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C]">
                      Similar Handcrafted Designs
                    </h3>
                    <p className="text-[11px] text-[#6A758E] hidden sm:block">
                      More botanical, Kalamkari, and block print totes
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#8A7E72] transition-transform duration-200 ${
                    expandedSections.similar ? 'rotate-180 text-[#D91680]' : ''
                  }`}
                />
              </button>
              {expandedSections.similar && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-[#F1E9DF]/60">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {relatedProducts.map((p) => (
                      <ProductCard key={p._id} product={p} onNavigate={onNavigate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Video Preview Modal */}
        {isVideoModalOpen && activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative bg-[#111622] rounded-3xl overflow-hidden max-w-3xl w-full border border-white/20 shadow-2xl">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white z-20 cursor-pointer transition-colors"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-3 sm:p-4 bg-black">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  <VideoPlayer
                    url={activeVideo.url}
                    poster={activeVideo.poster}
                    autoPlay={true}
                    controls={true}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="px-5 py-3.5 bg-[#171D2D] border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm truncate max-w-md">{product.name}</h4>
                  <p className="text-xs text-[#DBE586] font-medium">Artisan Handcrafted Showcase Video</p>
                </div>
                <span className="text-[11px] text-[#A6B4CD] bg-white/10 px-2.5 py-1 rounded-full">
                  🌿 100% Authentic
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Media Lightbox Modal */}
        {isLightboxOpen && mediaList.length > 0 && (
          <div
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 bg-black/95 backdrop-blur-md transition-opacity select-none"
          >
            {/* Lightbox Top Bar */}
            <div
              className="flex items-center justify-between text-white z-20 max-w-7xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <span className="font-serif-display font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                  {product.name}
                </span>
                {mediaList.length > 1 && (
                  <span className="bg-white/20 text-white text-xs font-mono px-2.5 py-0.5 rounded-full">
                    {activeMediaIdx + 1} / {mediaList.length}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white shadow-md transition-colors cursor-pointer"
                  aria-label="Close fullscreen viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Media with Left / Right Navigation Buttons */}
            <div
              className="relative flex-1 flex items-center justify-center my-2 max-w-7xl w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaList.length > 1 && (
                <button
                  onClick={() =>
                    setActiveMediaIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))
                  }
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1A1F2C] shadow-2xl transition-all hover:scale-110 z-20 cursor-pointer backdrop-blur-md"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}

              {mediaList[activeMediaIdx]?.type === 'video' ? (
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                  <VideoPlayer
                    url={mediaList[activeMediaIdx].url}
                    poster={mediaList[activeMediaIdx].poster}
                    autoPlay={true}
                    controls={true}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <img
                  src={mediaList[activeMediaIdx]?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200'}
                  alt={product.name}
                  className="max-h-[72vh] max-w-[88vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
                />
              )}

              {mediaList.length > 1 && (
                <button
                  onClick={() =>
                    setActiveMediaIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1A1F2C] shadow-2xl transition-all hover:scale-110 z-20 cursor-pointer backdrop-blur-md"
                  aria-label="Next media"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Navigation Strip */}
            {mediaList.length > 1 && (
              <div
                className="flex items-center justify-center space-x-2 overflow-x-auto py-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaList.map((item, i) => (
                  <button
                    key={item.id || i}
                    onClick={() => setActiveMediaIdx(i)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-900 cursor-pointer p-0.5 relative ${
                      activeMediaIdx === i
                        ? 'border-[#D91680] scale-110 shadow-lg ring-2 ring-[#D91680]/30'
                        : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <VideoThumbnail
                        videoUrl={item.url}
                        posterUrl={item.poster}
                        isActive={activeMediaIdx === i}
                        showBadge={false}
                        playIconSize="sm"
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <img src={item.url} alt="thumbnail" className="w-full h-full object-contain rounded-lg" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Sticky Bottom Purchasing Bar (The single unified conversion dock) */}
      <div className="fixed bottom-15 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#F1E9DF] px-3 sm:px-6 py-2.5 shadow-[0_-4px_20px_rgba(30,41,59,0.1)] pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          {/* Main cluster: Total + Stepper + Primary Add to Bag */}
          <div className="w-full sm:w-auto flex-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-[#8A7E72] tracking-wider truncate">Total</p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-[17px] sm:text-xl font-black text-[#1A1F2C] leading-tight">
                  {formatCurrency(product.price * quantity)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-[#8E9DBE] line-through">
                    {formatCurrency(product.originalPrice * quantity)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#E5E7EB] rounded-full bg-[#FAF7F2] h-9 sm:h-10 px-1 shadow-inner">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-[#1A1F2C] active:scale-90 font-bold cursor-pointer text-xs select-none"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-1.5 sm:px-2 text-xs font-bold text-[#1A1F2C] min-w-[18px] text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-[#1A1F2C] active:scale-90 font-bold cursor-pointer text-xs select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Primary CTA */}
              <button
                id="sticky-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={added || (product.stock !== undefined && product.stock <= 0)}
                className={`h-9 sm:h-10 px-4 sm:px-6 rounded-full text-xs font-bold uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  added
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-[#244537] hover:bg-[#193428] text-white border-[#244537]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C6A46A]" />
                <span>{added ? 'Added! ✓' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>

          {/* Secondary WhatsApp Instant Buy Button (Directly below on mobile, beside on sm:) */}
          <button
            id="sticky-whatsapp-buy-btn"
            onClick={handleDirectWhatsAppBuy}
            className="w-full sm:w-auto h-8 sm:h-10 px-3 sm:px-4 rounded-full bg-[#006C49] hover:bg-[#005a3d] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-98 cursor-pointer shrink-0 border border-emerald-700/40"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span>Instant Order via WhatsApp</span>
          </button>
        </div>
      </div>

    </div>
  );
};
