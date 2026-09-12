import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Gift, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalSavings, totalItems } = useCart();
  const { settings, showToast } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const threshold = settings.freeShippingThreshold || 1499;
  const remainingForFree = Math.max(0, threshold - subtotal);
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'ARTISAN10' || couponCode.toUpperCase() === 'VANA10') {
      setCouponApplied(true);
      showToast('🎉 Coupon ARTISAN10 applied! 10% discount added.', 'success');
    } else {
      showToast('Invalid promo code. Try "ARTISAN10"', 'warning');
    }
  };

  const handleProceedCheckout = () => {
    onNavigate('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-[70vh] py-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#EDE3D3] text-[#8C7D69] mx-auto flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif-display font-bold text-[#2A231C]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E5E]">
              You haven't added any handcrafted tote bags to your bag yet.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98"
          >
            Explore Tote Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8 pb-4 border-b border-[#E5DAC8] flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#27211A]">
              Shopping Bag ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
            </h1>
            <p className="text-xs text-[#786B5A] mt-1">
              Review your items before proceeding to instant WhatsApp order confirmation.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-[#8C5E3C] hover:text-red-700 underline"
          >
            Empty Bag
          </button>
        </div>

        {/* Free gift / Threshold banner */}
        <div className="mb-8 p-4 rounded-2xl bg-[#EFE7D8] border border-[#DFCDB7] flex items-center justify-between text-xs text-[#4D4233]">
          <div className="flex items-center space-x-2">
            <Gift className="w-4 h-4 text-[#8C5E3C] shrink-0" />
            <span>
              {remainingForFree > 0
                ? `Add ${formatCurrency(remainingForFree)} more to qualify for a Free Handcrafted Zipper Pouch!`
                : '🎉 Congratulations! Your order qualifies for a complimentary handmade cotton pouch.'}
            </span>
          </div>
          <span className="font-bold text-[#8C5E3C] hidden sm:inline">
            Free Gift Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image and Title */}
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => onNavigate('product-detail', item.product.slug)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-[#F5EFE6] border border-[#E0D5C3] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5E3C]">
                      {item.product.categoryName}
                    </span>
                    <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#241F18] hover:text-[#8C5E3C] transition-colors leading-snug">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[#7A6D5C] mt-0.5">
                      {item.product.dimensions || '450 GSM Canvas'}
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#241F18] sm:hidden">
                      {formatCurrency(item.product.price)}
                    </div>
                  </div>
                </div>

                {/* Price, Stepper & Total */}
                <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F2ECE1]">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-[#8A7E6E] block">Unit Price</span>
                    <span className="text-sm font-bold text-[#241F18]">
                      {formatCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center border border-[#D5C7B2] rounded-xl bg-[#FAF7F2] p-1">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-7 h-7 rounded text-[#52493C] hover:bg-white font-bold"
                    >
                      <Minus className="w-3 h-3 mx-auto" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-7 h-7 rounded text-[#52493C] hover:bg-white font-bold"
                    >
                      <Plus className="w-3 h-3 mx-auto" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-xs text-[#8A7E6E] block sm:hidden">Subtotal</span>
                    <span className="text-sm sm:text-base font-bold text-[#8C5E3C]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-[#998A76] hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Custom Gift Note text */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8DFD0] space-y-2">
              <label className="block text-xs font-bold text-[#2A241E] flex items-center space-x-1.5">
                <Gift className="w-4 h-4 text-[#8C5E3C]" />
                <span>Add a Personalized Gift Note / Celebration Message (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="e.g. Wishing you love and laughter on your special day! - From Sneha"
                className="w-full p-3 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C] resize-none"
              />
            </div>
          </div>

          {/* Order Summary Right (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-lg text-[#241F18] pb-3 border-b border-[#F2ECE1]">
                Order Summary
              </h3>

              {/* Promo code */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo code (ARTISAN10)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] uppercase font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B362F] hover:bg-[#26221D] text-white text-xs font-bold uppercase transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponApplied && (
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg flex items-center justify-between">
                  <span>✓ 10% Artisan Discount Active</span>
                  <button onClick={() => setCouponApplied(false)} className="text-red-600 underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-2 pt-2 text-xs text-[#52483B]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-medium text-[#241F18]">{formatCurrency(subtotal)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Catalog Discount</span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Promo Discount (10%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E8DFD0] flex justify-between text-base font-bold text-[#241F18]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#8C5E3C]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Mandated Delivery Note (FR-6) */}
              <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8DFD0] text-[11px] text-[#6E604F] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#8C5E3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Shipping Calculation:</strong> Prices exclude shipping. Exact delivery charges will be confirmed via WhatsApp chat based on delivery PIN code.
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-page-checkout-cta"
                onClick={handleProceedCheckout}
                className="w-full py-4 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full text-center text-xs font-semibold text-[#8C5E3C] hover:underline"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
