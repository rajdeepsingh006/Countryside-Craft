import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
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
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#E2D5C3]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E6DBCC] bg-[#F4EFE6] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#8C5E3C]" />
              <h2 className="text-base font-serif-display font-bold text-[#2A2621]">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-[#736859] hover:bg-[#EAE0D0] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Pouch / Threshold Progress */}
          <div className="px-6 py-3 bg-[#EFE7D8] border-b border-[#E0D3BE] text-xs">
            <div className="flex items-center justify-between font-medium text-[#4D4436] mb-1.5">
              <span>
                {remainingForFree > 0
                  ? `Add ${formatCurrency(remainingForFree)} more for a Free Handcrafted Pouch!`
                  : '🎉 Congratulations! You unlocked a Free Handcrafted Gift Pouch!'}
              </span>
              <span className="font-bold text-[#8C5E3C]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#DBCDB8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8C5E3C] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDE3D3] text-[#8C7D69] mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="text-base font-serif-display font-medium text-[#38322A]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#7B6F5F] mt-1 max-w-xs mx-auto">
                    Explore our botanical prints and hand-block printed totes to find your match.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('products');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Explore Tote Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex space-x-3.5 p-3.5 rounded-xl bg-white border border-[#E8DFD0] shadow-sm relative group"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-22 object-cover rounded-lg bg-[#F5EFE6] border border-[#E0D5C3] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs sm:text-sm font-medium text-[#2E2820] line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-[#9E907D] hover:text-red-600 transition-colors p-1 -mr-1 -mt-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#857764] block mt-0.5">
                        {item.product.categoryName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE6] mt-2">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-bold text-[#2E2820]">
                          {formatCurrency(item.product.price)}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className="text-[11px] text-[#998B77] line-through">
                            {formatCurrency(item.product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-2 bg-[#F7F3EB] rounded-lg p-0.5 border border-[#DFD4C3]">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#574D3F] hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#2E2820] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-[#574D3F] hover:bg-white transition-colors"
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

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F4EFE6] border-t border-[#E6DBCC] space-y-3.5">
              <div className="space-y-1.5 text-xs text-[#52483B]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#2E2820]">{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span className="flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Total Savings</span>
                    </span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E2D5C3] flex justify-between text-sm font-bold text-[#2A251E]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#8C5E3C]">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Shipping Notice Note (Mandated in PRD FR-6 & FR-12) */}
              <div className="p-2.5 rounded-lg bg-[#EFE6D6] border border-[#DFCDB7] text-[11px] text-[#635543] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#8C5E3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Delivery Note:</strong> Shipping charges will be calculated and confirmed over WhatsApp based on your pin code.
                </span>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2 pt-1">
                <button
                  id="drawer-checkout-btn"
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
                >
                  <span>WhatsApp Checkout ({formatCurrency(subtotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#EAE0D0] text-[#594E3F] text-xs font-semibold transition-colors text-center border border-[#D5C7B3]"
                >
                  View Full Cart & Add Gift Notes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
