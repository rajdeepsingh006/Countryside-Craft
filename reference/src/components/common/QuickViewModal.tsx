import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

interface QuickViewModalProps {
  onNavigate: (view: string, param?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { activeQuickViewProduct, closeQuickView } = useStore();
  const { addToCart } = useCart();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
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

  const handleGoToDetail = () => {
    closeQuickView();
    onNavigate('product-detail', product.slug);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DED2C0] max-w-3xl w-full overflow-hidden z-10 animate-scale-in">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#52493C] shadow-sm transition-colors z-20"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Images Gallery Left */}
          <div className="p-6 bg-[#F4EFE6] flex flex-col justify-between">
            <div className="relative rounded-xl overflow-hidden aspect-square bg-white border border-[#E0D5C3]">
              <img
                src={product.images[selectedImgIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#B33E2B] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIdx(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImgIdx === i ? 'border-[#8C5E3C] scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Right */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#8C5E3C] bg-[#EFE7D8] px-2.5 py-1 rounded-md">
                {product.categoryName}
              </span>

              <h2 className="text-xl font-serif-display font-bold text-[#2A241D] mt-2 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-[#2A241D] ml-1">{product.ratingAverage}</span>
                </div>
                <span className="text-xs text-[#8A7D6C]">({product.ratingCount} reviews)</span>
                <span className="text-xs text-[#5D8A5E] font-semibold">• In Stock ({product.stock} left)</span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline space-x-2.5">
                <span className="text-2xl font-bold text-[#2A241D]">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#948774] line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Delivery Note (FR-6) */}
              <p className="text-[11px] text-[#786C5B] mt-1 font-medium italic">
                * Prices exclude shipping/delivery charges (confirmed via WhatsApp).
              </p>

              <p className="text-xs text-[#52493E] mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Quick Specs */}
              <div className="mt-4 pt-3 border-t border-[#E8DFD0] grid grid-cols-2 gap-2 text-[11px] text-[#544B3E]">
                <div>
                  <span className="text-[#877A69] block">Material:</span>
                  <span className="font-medium">{product.material || 'Organic Cotton Duck Canvas'}</span>
                </div>
                <div>
                  <span className="text-[#877A69] block">Size / Capacity:</span>
                  <span className="font-medium">{product.dimensions || '16" H x 15" W'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#D5C7B2] rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded text-[#52493C] hover:bg-[#F2ECE1] font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 rounded text-[#52493C] hover:bg-[#F2ECE1] font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="quickview-add-to-cart-btn"
                  onClick={handleAdd}
                  disabled={added}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#3B362F] hover:bg-[#27231E] text-white active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatCurrency(product.price * qty)}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleGoToDetail}
                className="w-full py-2 rounded-lg text-xs font-semibold text-[#8C5E3C] hover:text-[#684227] flex items-center justify-center space-x-1.5 transition-colors"
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
