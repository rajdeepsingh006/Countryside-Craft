import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage = ({ onNavigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalSavings, totalItems } = useCart();
  const { settings, showToast } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.toUpperCase() === 'ARTISAN10' || couponCode.toUpperCase() === 'CC10') {
      setCouponApplied(true);
      showToast('🎉 Coupon applied! 10% discount added.', 'success');
    } else {
      showToast('Invalid promo code. Try "ARTISAN10" or "CC10"', 'warning');
    }
  };

  const handleProceedCheckout = () => {
    onNavigate('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FCFBFA] min-h-[70vh] py-20 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#EEF3FA] text-[#8E9DBE] mx-auto flex items-center justify-center shadow-inner border border-[#B9C9E7]/60">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif-display font-black text-[#1A1F2C]">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#6A758E]">
              You haven't added any handcrafted tote bags to your bag yet.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            Explore Tote Collection
          </button>
        </div>
      </div>
    );
  }

  const freePouchThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((subtotal / freePouchThreshold) * 100));
  const amountToFreePouch = Math.max(0, freePouchThreshold - subtotal);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-4 sm:py-10 pb-28 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Page Title & Clear Bag Trigger */}
        <div className="pb-3 border-b border-[#EADDC6]/40 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
              Shopping Bag ({totalItems})
            </h1>
            <p className="text-xs text-[#6A5E54] mt-0.5">
              Review your handcrafted items before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-[#D91680] hover:text-[#BE0E6E] underline cursor-pointer"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Pouch Milestone Progress Bar */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#F1E9DF] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#1A1F2C]">
              <span>🎁</span>
              <span>
                {amountToFreePouch > 0
                  ? `Add ${formatCurrency(amountToFreePouch)} more to unlock a FREE Handcrafted Coin Pouch!`
                  : `🎉 Unlocked! Free Handcrafted Pouch added to your parcel.`}
              </span>
            </div>
            <span className="text-[11px] font-black text-[#D91680] shrink-0">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden border border-[#F1E9DF]">
            <div
              className="h-full bg-gradient-to-r from-[#D91680] to-[#EFC0DA] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="p-3 sm:p-4 rounded-2xl bg-white border border-[#F1E9DF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                {/* Image and Title */}
                <div
                  className="flex items-center space-x-3 sm:space-x-4 cursor-pointer w-full sm:w-auto"
                  onClick={() => onNavigate('product-detail', item.product.slug)}
                >
                  {item.product.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl bg-[#FAF7F2] border border-[#F1E9DF] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#EAE0D4] border border-[#E4D7C8] flex flex-col items-center justify-center text-center p-1 shrink-0 text-[#D91680]">
                      <Sparkles className="w-5 h-5 opacity-75 mb-0.5" />
                      <span className="text-[9px] font-bold text-[#8A7A6C] uppercase leading-none">Craft</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D91680] block">
                      {item.product.categoryName || item.product.category?.name || item.product.category}
                    </span>
                    <h3 className="font-sans font-medium text-[13px] sm:text-base text-[#1A1F2C] hover:text-[#D91680] transition-colors leading-tight line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-[#6A5E54] mt-0.5 truncate">
                      {item.product.dimensions || '450 GSM Heavy Canvas'}
                    </p>
                    <div className="mt-1 text-xs font-bold text-[#1A1F2C] sm:hidden">
                      {formatCurrency(item.product.price)}
                    </div>
                  </div>
                </div>

                {/* Price, Stepper & Total */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#FAF7F2]">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-[#8A7E72] block">Unit Price</span>
                    <span className="text-sm font-bold text-[#1A1F2C]">
                      {formatCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center border border-[#E5E7EB] rounded-full bg-[#FAF7F2] h-8 px-1 shadow-inner">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#1A1F2C] active:scale-90 font-bold cursor-pointer text-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-black text-[#1A1F2C] min-w-[16px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#1A1F2C] active:scale-90 font-bold cursor-pointer text-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[60px] sm:min-w-[70px]">
                    <span className="text-[10px] text-[#8A7E72] block sm:hidden">Total</span>
                    <span className="text-xs sm:text-base font-black text-[#D91680]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove item */}
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-1.5 text-[#8A7E72] hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Right (4 cols) */}
          <div className="lg:col-span-4 space-y-4">

            <div className="p-5 rounded-3xl bg-white border border-[#F1E9DF] shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C] pb-2 border-b border-[#F1E9DF]">
                Order Breakdown
              </h3>

              {/* Promo code */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] text-[#1A1F2C] uppercase font-mono focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {/* Quick-Apply Chips */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-[#8A7E72] uppercase font-bold">Try:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('FESTIVE10');
                      setCouponApplied(true);
                      showToast('🎉 FESTIVE10 applied! 10% discount added.', 'success');
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FDF2F8] text-[#BE185D] text-[10px] font-bold border border-[#EFC0DA] hover:bg-[#FCE7F3] cursor-pointer"
                  >
                    FESTIVE10
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('ARTISAN10');
                      setCouponApplied(true);
                      showToast('🎉 ARTISAN10 applied! 10% discount added.', 'success');
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#6A5E54] text-[10px] font-bold border border-[#E5DDD0] hover:bg-[#F2ECE0] cursor-pointer"
                  >
                    ARTISAN10
                  </button>
                </div>
              </div>

              {couponApplied && (
                <div className="text-[11px] text-[#006C49] font-bold bg-[#ECFDF5] p-2.5 rounded-xl flex items-center justify-between border border-[#A7F3D0]">
                  <span>✓ 10% Festive Discount Active</span>
                  <button onClick={() => setCouponApplied(false)} className="text-red-600 underline cursor-pointer">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-2 pt-1 text-xs text-[#3E475C]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-[#1A1F2C]">{formatCurrency(subtotal)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Catalog Discount</span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo Discount (10%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6A5E54]">
                  <span>Free Gift Pouch</span>
                  <span className="font-bold text-[#006C49]">
                    {amountToFreePouch === 0 ? 'Unlocked (₹0)' : 'Eligible above ₹1,999'}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#F1E9DF] flex justify-between text-base font-bold text-[#1A1F2C]">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-[#D91680]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Mandated Delivery Note */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#F1E9DF] text-[11px] text-[#6A5E54] leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#D91680] shrink-0 mt-0.5" />
                <span>
                  <strong>Shipping Note:</strong> Delivery charges are extra and will be confirmed on WhatsApp based on your delivery PIN code.
                </span>
              </div>

              {/* Checkout CTA (Desktop) */}
              <button
                id="cart-page-checkout-cta"
                onClick={handleProceedCheckout}
                className="hidden md:flex w-full h-12 py-3.5 px-4 rounded-full bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all items-center justify-center space-x-2 active:scale-98 cursor-pointer border border-[#EFC0DA]"
              >
                <span>Proceed to Shipping & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full text-center text-xs font-bold text-[#D91680] hover:underline cursor-pointer"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Checkout Bar (Pinned above bottom tab bar) */}
      <div className="fixed bottom-15 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-[#F1E9DF] px-4 py-3 shadow-[0_-4px_16px_rgba(30,41,59,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase font-bold text-[#8A7E72] tracking-wider truncate">Total Payable</p>
          <span className="text-[18px] font-black text-[#1A1F2C] leading-tight">
            {formatCurrency(finalTotal)}
          </span>
        </div>

        <button
          onClick={handleProceedCheckout}
          className="h-11 px-5 rounded-full bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center space-x-1.5 border border-[#EFC0DA] cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
