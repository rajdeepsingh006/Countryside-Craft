import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, Play } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { VideoThumbnail } from '../common/VideoThumbnail';
import { isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';
import { getAssetUrl } from '../../utils/assetHelper';

export const ProductCard = ({ product, onNavigate, layout = 'grid' }) => {
  const { addToCart } = useCart();
  const { openQuickView } = useStore();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
  const rawPrimaryImage = firstPhoto || (firstVideo ? getVideoThumbnail(firstVideo, product.videoThumbnail) : null);
  const primaryImage = rawPrimaryImage ? getAssetUrl(rawPrimaryImage) : null;

  const displayOriginalPrice =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : product.discountPercent > 0
      ? Math.round(product.price / (1 - product.discountPercent / 100))
      : null;

  // ─── Horizontal Row Layout ───────────────────────────────────────────────
  if (layout === 'horizontal') {
    return (
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E7DFD2] hover:border-[#244537]/40 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row cursor-pointer p-2.5 sm:p-3.5 gap-3 sm:gap-4 items-stretch"
      >
        {/* Left Horizontal Image */}
        <div className="relative w-full sm:w-56 md:w-64 aspect-[16/10] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8F5EF]">
          {primaryImage && !imageError ? (
            <img
              src={primaryImage}
              alt={product.name}
              onError={() => setImageError(true)}
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
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#F8F5EF] via-[#F0EBE1] to-[#E7DFD2]">
              <Sparkles className="w-6 h-6 text-[#244537] mb-1" />
              <span className="font-brand-script text-base text-[#193428]">Countryside Craft</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6D756D] mt-0.5">
                Handcrafted Piece
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountPercent > 0 && (
              <span className="bg-[#F8F5EF] text-[#A94F2B] text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-[#E7DFD2]">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-[#F8F5EF] text-[#A94F2B] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-[#C6A46A]">
                ★ BESTSELLER
              </span>
            )}
          </div>
        </div>

        {/* Right Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between text-[11px] gap-2 mb-1">
              <span className="font-bold uppercase tracking-wider text-[#A94F2B] text-[10px]">
                {(product.categoryName || product.category?.name || product.category || '')
                  .replace(' Prints', '')
                  .replace(' Collection', '')}
              </span>
              <div className="flex items-center space-x-1 shrink-0 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="text-[#34443A]">{product.ratingAverage || '4.9'}</span>
                <span className="text-[#6D756D] font-normal text-[11px]">({product.ratingCount || 12})</span>
              </div>
            </div>

            <h3 className="font-sans font-bold text-base sm:text-lg text-[#193428] group-hover:text-[#244537] transition-colors leading-snug line-clamp-1 mb-1">
              {product.name}
            </h3>

            {product.tagline && (
              <p className="text-xs text-[#6D756D] line-clamp-2 leading-relaxed mb-2">
                {product.tagline}
              </p>
            )}

            {product.material && (
              <span className="inline-block text-[11px] text-[#6D756D] bg-[#F0EBE1] px-2.5 py-0.5 rounded-md font-medium border border-[#E7DFD2] mb-2">
                🌿 {product.material}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E7DFD2] mt-2">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg sm:text-xl font-bold text-[#193428]">
                {formatCurrency(product.price)}
              </span>
              {displayOriginalPrice && displayOriginalPrice > product.price && (
                <span className="text-xs text-[#6D756D] line-through">
                  {formatCurrency(displayOriginalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleQuickView}
                className="hidden sm:flex p-2 rounded-xl bg-[#F0EBE1] hover:bg-[#E7DFD2] text-[#193428] text-xs font-bold transition-colors cursor-pointer"
                title="Quick preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={added || product.stock <= 0}
                className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer border ${
                  added
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : product.stock <= 0
                    ? 'bg-neutral-200 text-neutral-500 border-neutral-300 cursor-not-allowed'
                    : 'bg-[#244537] hover:bg-[#193428] text-white border-[#244537] active:scale-98'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C6A46A]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Grid Layout (Horizontal Image Format) ────────────────────────────────
  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E7DFD2] hover:border-[#244537]/40 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer p-2 sm:p-3"
    >
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#F8F5EF]">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={product.name}
            onError={() => setImageError(true)}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#F8F5EF] via-[#F0EBE1] to-[#E7DFD2] border border-[#E7DFD2] relative select-none">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white/85 shadow-2xs border border-[#E7DFD2] flex items-center justify-center text-[#244537] mb-2 sm:mb-2.5 transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#244537]" />
            </div>
            <span className="font-brand-script text-base sm:text-lg text-[#193428] leading-tight tracking-wide">
              Countryside Craft
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#6D756D] mt-0.5">
              Handcrafted Piece
            </span>
            <span className="text-[9px] text-[#6D756D] mt-1.5 bg-white/70 px-2 py-0.5 rounded-full border border-[#E7DFD2] font-medium">
              Artisan Original
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasVideo && primaryImage && (
            <span className="bg-[#193428]/90 text-[#C6A46A] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-white/40 flex items-center gap-1 w-fit">
              <span>▶</span> VIDEO
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-[#F8F5EF] text-[#A94F2B] text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-[#E7DFD2] w-fit">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#F8F5EF] text-[#A94F2B] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-[#C6A46A] flex items-center gap-0.5 w-fit">
              <span>★</span> BESTSELLER
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="bg-[#F8F5EF] text-[#244537] text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs border border-[#244537] w-fit">
              NEW
            </span>
          )}
        </div>

        {/* Quick View Button (Desktop) */}
        <button
          onClick={handleQuickView}
          title="Quick preview"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 hover:bg-white text-[#244537] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10 hidden md:flex cursor-pointer border border-[#E7DFD2]"
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
              ? 'bg-emerald-700 text-white'
              : product.stock <= 0
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-[#244537] text-white hover:bg-[#193428]'
          }`}
        >
          {added ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-xl font-bold leading-none mb-0.5">+</span>
          )}
        </button>

        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-1.5 left-1.5 bg-[#193428]/90 text-[#C6A46A] text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="pt-2 sm:pt-3 px-1 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-2 mb-0.5">
            <span
              title={product.categoryName || product.category}
              className="font-bold uppercase tracking-wider text-[#A94F2B] text-[10px] truncate max-w-[140px]"
            >
              {(product.categoryName || product.category?.name || product.category || '')
                .replace(' Prints', '')
                .replace(' Collection', '')}
            </span>
            <div className="flex items-center space-x-1 shrink-0 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span className="text-[#34443A]">{product.ratingAverage || '4.9'}</span>
              <span className="text-[#6D756D] font-normal text-[10px]">({product.ratingCount || 12})</span>
            </div>
          </div>
          <h3
            title={product.name}
            className="font-sans font-medium text-[14px] sm:text-[15px] text-[#193428] group-hover:text-[#244537] transition-colors line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem] leading-tight break-words"
          >
            {product.name}
          </h3>
        </div>

        <div className="pt-1.5 border-t border-[#E7DFD2]">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-[16px] sm:text-[18px] font-bold text-[#193428]">
              {formatCurrency(product.price)}
            </span>
            {displayOriginalPrice && displayOriginalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-[#6D756D] line-through">
                {formatCurrency(displayOriginalPrice)}
              </span>
            )}
          </div>

          {/* Full Add to Bag button on desktop */}
          <button
            onClick={handleAddToCart}
            disabled={added || product.stock <= 0}
            className={`mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hidden md:flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer border ${
              added
                ? 'bg-emerald-700 text-white border-emerald-700'
                : product.stock <= 0
                ? 'bg-neutral-200 text-neutral-500 border-neutral-300 cursor-not-allowed'
                : 'bg-[#244537] hover:bg-[#193428] text-white border-[#244537] active:scale-98 shadow-xs'
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
                <ShoppingBag className="w-3.5 h-3.5 text-[#C6A46A]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

