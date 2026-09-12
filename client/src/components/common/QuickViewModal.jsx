import React, { useState, useMemo } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, ArrowRight, Sparkles, Play } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { VideoPlayer } from './VideoPlayer';
import { VideoThumbnail } from './VideoThumbnail';
import { parseVideoUrl, isVideoUrl, getVideoThumbnail } from '../../utils/videoHelpers';

export const QuickViewModal = ({ onNavigate }) => {
  const { activeQuickViewProduct, closeQuickView } = useStore();
  const { addToCart } = useCart();
  const [selectedMediaIdx, setSelectedMediaIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!activeQuickViewProduct) return null;
  const product = activeQuickViewProduct;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeQuickView();
    }, 900);
  };

  const mediaList = useMemo(() => {
    if (!product) return [];
    const list = [];
    const seen = new Set();

    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((url, idx) => {
        if (!url || typeof url !== 'string' || !url.trim()) return;
        const trimmed = url.trim();
        if (seen.has(trimmed)) return;
        seen.add(trimmed);

        if (isVideoUrl(trimmed)) {
          const parsed = parseVideoUrl(trimmed);
          const poster = (product.videoThumbnail && product.videoThumbnail.trim()) || getVideoThumbnail(trimmed) || '';
          list.push({
            type: 'video',
            url: trimmed,
            parsed,
            poster,
            id: `video-${idx}`,
          });
        } else {
          list.push({
            type: 'image',
            url: trimmed,
            id: `img-${idx}`,
          });
        }
      });
    }

    if (product.video && typeof product.video === 'string' && product.video.trim()) {
      const trimmed = product.video.trim();
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        const parsed = parseVideoUrl(trimmed);
        const poster = (product.videoThumbnail && product.videoThumbnail.trim()) || getVideoThumbnail(trimmed) || '';
        list.push({
          type: 'video',
          url: trimmed,
          parsed,
          poster,
          id: 'video-main',
        });
      }
    }
    return list;
  }, [product]);

  const activeMedia = mediaList[selectedMediaIdx] || mediaList[0];
  const isVideo = activeMedia?.type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={closeQuickView} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-[#B9C9E7]/60 animate-scale-up">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-[#1A1F2C] shadow-md transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-[#FAF7F2] flex flex-col justify-between">
            <div className={`relative rounded-2xl overflow-hidden aspect-square border border-[#EADBCE]/60 flex items-center justify-center ${
              isVideo ? 'bg-black' : 'bg-white'
            }`}>
              {mediaList.length > 0 ? (
                isVideo ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoPlayer
                      url={activeMedia.url}
                      poster={activeMedia.poster}
                      autoPlay={false}
                      controls={true}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FDFBF7] via-[#F6EFE5] to-[#EAE0D2] select-none">
                  <div className="w-16 h-16 rounded-2xl bg-white/85 shadow-xs border border-[#E6D8C8] flex items-center justify-center text-[#D91680] mb-3">
                    <Sparkles className="w-8 h-8 text-[#D91680]" />
                  </div>
                  <span className="font-brand-script text-2xl text-[#1A1F2C]">Countryside Craft</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A7A6C] mt-1">
                    Artisan Original
                  </span>
                  <span className="text-[10px] text-[#9E8E80] mt-2 bg-white/80 px-2.5 py-0.5 rounded-full border border-[#EADBCE]">
                    Handcrafted Piece
                  </span>
                </div>
              )}
              {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#EFC0DA] text-[#86124F] text-xs font-black px-2.5 py-1 rounded-full shadow-sm border border-white">
                  {product.discountPercent}% OFF
                </span>
              )}
              {isVideo && (
                <span className="absolute bottom-3 left-3 bg-[#1A1F2C]/90 text-[#DBE586] text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm border border-white/30 flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                  <Play className="w-3 h-3 fill-[#DBE586]" /> Showcase Video
                </span>
              )}
            </div>
            {mediaList.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                {mediaList.map((item, i) => (
                  <button
                    key={item.id || i}
                    onClick={() => setSelectedMediaIdx(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer relative ${
                      selectedMediaIdx === i
                        ? 'border-[#D91680] scale-105 shadow-sm ring-2 ring-[#D91680]/25'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <VideoThumbnail
                        videoUrl={item.url}
                        posterUrl={item.poster}
                        isActive={selectedMediaIdx === i}
                        showBadge={true}
                        badgeText="VIDEO"
                        playIconSize="sm"
                        className="w-full h-full rounded-lg"
                      />
                    ) : (
                      <img src={item.url} alt="thumbnail" className="w-full h-full object-contain p-0.5 bg-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black text-[#D91680] tracking-widest block">
                {product.categoryName || product.category}
              </span>
              <h2 className="text-xl font-serif-display font-black text-[#1A1F2C] mt-1 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-xs font-bold text-[#1A1F2C]">{product.ratingAverage || 0}</span>
                <span className="text-xs text-[#6A758E]">({product.ratingCount || 0} reviews)</span>
                <span className="text-xs text-emerald-700 font-bold">• In Stock ({product.stock} left)</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2.5">
                <span className="text-2xl font-black text-[#1A1F2C]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#8E9DBE] line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6A758E] mt-1 font-medium italic">
                * Prices exclude shipping/delivery charges (confirmed via WhatsApp).
              </p>
              <p className="text-xs text-[#3E475C] mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 pt-3 border-t border-[#EEF3FA] grid grid-cols-2 gap-2 text-[11px] text-[#3E475C]">
                <div>
                  <span className="text-[#6A758E] block font-semibold">Material:</span>
                  <span className="font-bold">{product.material || 'Organic Cotton Duck Canvas'}</span>
                </div>
                <div>
                  <span className="text-[#6A758E] block font-semibold">Size / Capacity:</span>
                  <span className="font-bold">{product.dimensions || '16" H x 15" W'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-[#B9C9E7] rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg text-[#1A1F2C] hover:bg-[#EEF3FA] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                    className="w-8 h-8 rounded-lg text-[#1A1F2C] hover:bg-[#EEF3FA] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  id="quickview-add-to-cart-btn"
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#D91680] hover:bg-[#BE0E6E] text-white active:scale-98 border border-[#EFC0DA]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#EFC0DA]" />
                      <span>Add to Bag • {formatCurrency(product.price * qty)}</span>
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={() => {
                  closeQuickView();
                  onNavigate('product-detail', product.slug);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#D91680] hover:text-[#BE0E6E] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Details, Videos & Customer Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
