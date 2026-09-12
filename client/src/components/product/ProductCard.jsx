import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, Play } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { VideoThumbnail } from '../common/VideoThumbnail';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const ProductCard = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { openQuickView } = useStore();
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    onNavigate('product-detail', product.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  const handleQuickView = (e) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const firstPhoto = images.find((img) => !isVideoUrl(img));
  const firstVideo = images.find((img) => isVideoUrl(img)) || (product.video && product.video.trim() ? product.video.trim() : null);

  const hasVideo = Boolean(firstVideo);
  const primaryImage = firstPhoto || (firstVideo ? getVideoThumbnail(firstVideo, product.videoThumbnail) : null);

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#F1E9DF] hover:border-[#EADDC6] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer p-2 sm:p-3"
    >
      <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F2]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : firstVideo ? (
          <VideoThumbnail
            url={firstVideo}
            poster={product.videoThumbnail}
            alt={product.name}
            playIconSize="md"
            badgeText="VIDEO"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#FDFBF7] via-[#F6EFE5] to-[#EAE0D2] border border-[#EADBCE]/50 relative select-none">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white/85 shadow-2xs border border-[#E6D8C8] flex items-center justify-center text-[#D91680] mb-2 sm:mb-2.5 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#D91680]" />
            </div>
            <span className="font-brand-script text-base sm:text-lg text-[#1A1F2C] leading-tight tracking-wide">
              Countryside Craft
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#8A7A6C] mt-0.5">
              Handcrafted Piece
            </span>
            <span className="text-[9px] text-[#A69485] mt-1.5 bg-white/70 px-2 py-0.5 rounded-full border border-[#EADBCE] font-medium">
              Artisan Original
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasVideo && primaryImage && (
            <span className="bg-[#1A1F2C]/90 text-[#DBE586] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-white/40 flex items-center gap-1 w-fit">
              <span>▶</span> VIDEO
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-[#FDF2F8] text-[#BE185D] text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-white w-fit">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#FEF3C7] text-[#B45309] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-white flex items-center gap-0.5 w-fit">
              <span>★</span> BESTSELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="bg-[#EFF6FF] text-[#1D4ED8] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-white w-fit">
              NEW
            </span>
          )}
        </div>

        {/* Quick View Button (Desktop) */}
        <button
          onClick={handleQuickView}
          title="Quick preview"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-[#D91680] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10 hidden md:flex cursor-pointer"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Floating Quick Add Action Button (Mobile) */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          aria-label={`Add ${product.name} to bag`}
          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform z-10 md:hidden ${
            added
              ? 'bg-emerald-600 text-white'
              : product.stock <= 0
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-white text-[#D91680] hover:bg-[#FAF7F2]'
          }`}
        >
          {added ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-xl font-bold leading-none mb-0.5">+</span>
          )}
        </button>

        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-1.5 left-1.5 bg-[#1A1F2C]/85 text-[#DBE586] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="pt-2 sm:pt-3 px-1 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-2 mb-0.5">
            <span
              title={product.categoryName || product.category}
              className="font-bold uppercase tracking-wider text-[#D91680] text-[10px] truncate max-w-[140px]"
            >
              {(product.categoryName || product.category?.name || product.category || '')
                .replace(' Prints', '')
                .replace(' Collection', '')}
            </span>
            <div className="flex items-center space-x-1 shrink-0 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span className="text-[#1A1F2C]">{product.ratingAverage || '4.9'}</span>
              <span className="text-[#8E9DBE] font-normal text-[10px]">({product.ratingCount || 12})</span>
            </div>
          </div>
          <h3
            title={product.name}
            className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1A1F2C] group-hover:text-[#D91680] transition-colors line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem] leading-tight break-words"
          >
            {product.name}
          </h3>
        </div>

        <div className="pt-1.5 border-t border-[#F1E9DF]">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-[16px] sm:text-[18px] font-bold text-[#1A1F2C]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-[#8E9DBE] line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Full Add to Bag button on desktop */}
          <button
            onClick={handleAddToCart}
            disabled={added || product.stock <= 0}
            className={`mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hidden md:flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-[#D91680] hover:bg-[#BE0E6E] text-white active:scale-98 shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#EFC0DA]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

