import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer = ({ onNavigate }) => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalSavings, totalItems } = useCart();
  const { settings } = useStore();

  if (!isCartOpen) return null;

  const threshold = settings.freeShippingThreshold || 1499;
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));
  const remainingForFree = Math.max(0, threshold - subtotal);

  const handleGoToCheckout = () => {
    closeCart();
    onNavigate('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleGoToCartPage = () => {
    closeCart();
    onNavigate('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={closeCart} className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#B9C9E7]/60">
          
          <div className="px-6 py-5 border-b border-[#B9C9E7]/40 bg-[#EEF3FA] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D91680]" />
              <h2 className="text-base font-serif-display font-bold text-[#1A1F2C]">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#6A758E] hover:bg-[#DEE8F7] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-3 bg-[#FCFBFA] border-b border-[#B9C9E7]/40 text-xs">
            <div className="flex items-center justify-between font-bold text-[#1A1F2C] mb-1.5">
              <span>
                {remainingForFree > 0
                  ? `Add ${formatCurrency(remainingForFree)} more for a Free Handcrafted Pouch!`
                  : '🎉 You unlocked a Free Handcrafted Gift Pouch!'}
              </span>
              <span className="font-black text-[#D91680]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#EEF3FA] rounded-full overflow-hidden border border-[#B9C9E7]/40">
              <div
                className="h-full bg-gradient-to-r from-[#DBE586] via-[#B9C9E7] to-[#D91680] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EEF3FA] text-[#8E9DBE] mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="text-base font-serif-display font-bold text-[#1A1F2C]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#6A758E] mt-1 max-w-xs mx-auto">
                    Explore our botanical prints and hand-block printed totes to find your match.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('products');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer border border-[#EFC0DA]"
                >
                  Explore Tote Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex space-x-3.5 p-3.5 rounded-2xl bg-white border border-[#B9C9E7]/50 shadow-xs"
                >
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-[#FAF7F2] border border-[#B9C9E7]/50 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#EAE0D4] border border-[#E4D7C8] flex flex-col items-center justify-center text-center p-1 shrink-0 text-[#D91680]">
                      <Sparkles className="w-5 h-5 opacity-75 mb-0.5" />
                      <span className="text-[9px] font-bold text-[#8A7A6C] uppercase leading-none">Craft</span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1F2C] line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-[#8E9DBE] hover:text-red-600 transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#EEF3FA] mt-2">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-black text-[#1A1F2C]">
                          {formatCurrency(item.product.price)}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-[11px] text-[#8E9DBE] line-through">
                            {formatCurrency(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 bg-[#EEF3FA] rounded-lg p-0.5 border border-[#B9C9E7]/60">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#1A1F2C] hover:bg-white transition-colors cursor-pointer font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#1A1F2C] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#1A1F2C] hover:bg-white transition-colors cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-[#EEF3FA]/70 border-t border-[#B9C9E7]/50 space-y-3.5">
              <div className="space-y-1.5 text-xs text-[#3E475C]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-[#1A1F2C]">{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Total Savings</span>
                    </span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#B9C9E7]/50 flex justify-between text-sm font-bold text-[#1A1F2C]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#D91680] font-black">{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#B9C9E7]/60 text-[11px] text-[#4B566E] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#D91680] shrink-0 mt-0.5" />
                <span>
                  <strong>Delivery Note:</strong> Shipping charges will be calculated and confirmed over WhatsApp based on your pin code.
                </span>
              </div>
              <div className="space-y-2 pt-1">
                <button
                  id="drawer-checkout-btn"
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Shipping ({formatCurrency(subtotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-[#EEF3FA] text-[#1A1F2C] text-xs font-bold transition-colors text-center border border-[#B9C9E7] cursor-pointer"
                >
                  View Full Cart Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
