import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { openQuickView } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCardClick = () => {
    onNavigate('product-detail', product.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images[1] || primaryImage;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-[#E8DFD0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      
      {/* Image Container with Hover Swap */}
      <div className="relative aspect-[4/5] bg-[#F5EFE6] overflow-hidden">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="bg-[#B33E2B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#8C5E3C] text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              New Arrival
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <button
          onClick={handleQuickView}
          title="Quick preview"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#383126] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10 hidden sm:flex"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Low Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-[#2D2A26]/85 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
            Only {product.stock} left
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#827564]">
            <span className="font-semibold uppercase tracking-wider truncate mr-1">
              {product.categoryName}
            </span>
            <div className="flex items-center space-x-1 shrink-0 text-amber-600 font-semibold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.ratingAverage}</span>
              <span className="text-[#A39785]">({product.ratingCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#241F18] group-hover:text-[#8C5E3C] transition-colors line-clamp-2 mt-1 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price & Delivery Note */}
        <div className="pt-2 border-t border-[#F2ECE1]">
          <div className="flex items-baseline space-x-2">
            <span className="text-base sm:text-lg font-bold text-[#241F18]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#968975] line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-[#7A6D5A] mt-0.5 italic">
            + Shipping charges extra
          </p>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={added || product.stock <= 0}
            className={`mt-3 w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-[#3B362F] hover:bg-[#8C5E3C] text-white active:scale-98'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag!</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#EDE3D3]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
