import React, { useState, useMemo } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles, Truck, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { getAssetUrl } from '../utils/assetHelper';
import { calculateSpeedPostShipping } from '../utils/shippingCalculator';
import { lookupPincode } from '../services/pincodeService';

export const CartPage = ({ onNavigate }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalSavings, totalItems } = useCart();
  const { settings, showToast } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingPincode, setShippingPincode] = useState('');
  const [shippingLocation, setShippingLocation] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const itemsAfterDiscount = Math.max(0, subtotal - discountAmount);

  // Calculate live Speed Post shipping based on cart weight & destination
  const cartShipping = useMemo(() => {
    return calculateSpeedPostShipping({
      state: shippingLocation?.state || 'Punjab',
      city: shippingLocation?.city || 'Sirhind',
      pincode: shippingPincode,
      cartItems: cart,
    });
  }, [shippingLocation, shippingPincode, cart]);

  const deliveryCharge = cartShipping.charge || 42;
  const finalTotal = itemsAfterDiscount + deliveryCharge;

  const handlePincodeEstimate = async (val) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setShippingPincode(clean);

    if (clean.length === 6) {
      setPincodeLoading(true);
      try {
        const loc = await lookupPincode(clean);
        if (loc) {
          setShippingLocation(loc);
          showToast(`Speed Post updated for ${loc.city}, ${loc.state}`, 'info');
        } else {
          setShippingLocation(null);
        }
      } catch (err) {
        console.warn('Cart PIN lookup notice:', err);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setShippingLocation(null);
    }
  };

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
            className="px-8 py-3.5 rounded-2xl bg-[#244537] hover:bg-[#193428] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer border border-[#193428]"
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
    <div className="bg-[#F8F5EF] min-h-screen py-4 sm:py-10 pb-44 sm:pb-48 md:pb-12 text-[#34443A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Page Title & Clear Bag Trigger */}
        <div className="pb-3 border-b border-[#E7DFD2] flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-serif-display font-bold text-[#193428]">
              Shopping Bag ({totalItems})
            </h1>
            <p className="text-xs text-[#6D756D] mt-0.5">
              Review your handcrafted items before proceeding to checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-[#A94F2B] hover:text-[#883e20] underline cursor-pointer"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Pouch Milestone Progress Bar */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#193428]">
              <span>🎁</span>
              <span>
                {amountToFreePouch > 0
                  ? `Add ${formatCurrency(amountToFreePouch)} more to unlock a FREE Handcrafted Coin Pouch!`
                  : `🎉 Unlocked! Free Handcrafted Pouch added to your parcel.`}
              </span>
            </div>
            <span className="text-[11px] font-black text-[#244537] shrink-0">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F0EBE1] overflow-hidden border border-[#E7DFD2]">
            <div
              className="h-full bg-gradient-to-r from-[#C6A46A] to-[#244537] transition-all duration-500 rounded-full"
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
                      src={getAssetUrl(item.product.images[0])}
                      alt={item.product.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl bg-[#FAF7F2] border border-[#F1E9DF] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-br from-[#F0EBE1] to-[#E7DFD2] border border-[#E7DFD2] flex flex-col items-center justify-center text-center p-1 shrink-0 text-[#244537]">
                      <Sparkles className="w-5 h-5 opacity-75 mb-0.5 text-[#C6A46A]" />
                      <span className="text-[9px] font-bold text-[#6D756D] uppercase leading-none">Craft</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A94F2B] block">
                      {item.product.categoryName || item.product.category?.name || item.product.category}
                    </span>
                    <h3 className="font-sans font-medium text-[13px] sm:text-base text-[#193428] hover:text-[#244537] transition-colors leading-tight line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-[#6D756D] mt-0.5 truncate">
                      {item.product.dimensions || '450 GSM Heavy Canvas'}
                    </p>
                    <div className="mt-1 text-xs font-bold text-[#193428] sm:hidden">
                      {formatCurrency(item.product.price)}
                    </div>
                  </div>
                </div>

                {/* Price, Stepper & Total */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#FAF7F2]">
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-[#6D756D] block">Unit Price</span>
                    <span className="text-sm font-bold text-[#193428]">
                      {formatCurrency(item.product.price)}
                    </span>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center border border-[#E7DFD2] rounded-full bg-[#F0EBE1] h-8 px-1 shadow-inner">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#193428] active:scale-90 font-bold cursor-pointer text-xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-black text-[#193428] min-w-[16px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#193428] active:scale-90 font-bold cursor-pointer text-xs"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[60px] sm:min-w-[70px]">
                    <span className="text-[10px] text-[#6D756D] block sm:hidden">Total</span>
                    <span className="text-xs sm:text-base font-black text-[#193428]">
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
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F0EBE1] border border-[#E7DFD2] text-[#34443A] uppercase font-mono focus:outline-none focus:border-[#244537]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#244537] hover:bg-[#193428] text-[#FFFFFF] text-xs font-bold uppercase transition-colors cursor-pointer active:scale-98 border border-[#193428]"
                  >
                    Apply
                  </button>
                </form>

                {/* Quick-Apply Chips */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-[#6D756D] uppercase font-bold">Try:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('FESTIVE10');
                      setCouponApplied(true);
                      showToast('🎉 FESTIVE10 applied! 10% discount added.', 'success');
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#F0EBE1] text-[#A94F2B] text-[10px] font-bold border border-[#E7DFD2] hover:bg-[#E7DFD2] cursor-pointer active:scale-98"
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
                    className="px-2 py-0.5 rounded-md bg-[#F0EBE1] text-[#244537] text-[10px] font-bold border border-[#E7DFD2] hover:bg-[#E7DFD2] cursor-pointer active:scale-98"
                  >
                    ARTISAN10
                  </button>
                </div>
              </div>

              {couponApplied && (
                <div className="text-[11px] text-[#356B49] font-bold bg-[#356B49]/10 p-2.5 rounded-xl flex items-center justify-between border border-[#356B49]/20">
                  <span>✓ 10% Festive Discount Active</span>
                  <button onClick={() => setCouponApplied(false)} className="text-[#A83232] underline cursor-pointer">
                    Remove
                  </button>
                </div>
              )}

              {/* Delivery PIN Code Estimator */}
              <div className="p-3.5 rounded-2xl bg-[#F0EBE1] border border-[#E7DFD2] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#193428]">
                    <Truck className="w-3.5 h-3.5 text-[#244537]" />
                    <span>Speed Post Delivery Estimator</span>
                  </div>
                  {pincodeLoading && (
                    <span className="text-[10px] text-[#244537] flex items-center gap-1 font-semibold">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking PIN...
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={shippingPincode}
                    onChange={(e) => handlePincodeEstimate(e.target.value)}
                    placeholder="Enter 6-digit delivery PIN code..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E7DFD2] text-[#34443A] focus:outline-none focus:border-[#244537]"
                  />
                  {shippingLocation && !pincodeLoading && (
                    <span className="absolute right-2.5 top-2 text-[#356B49]" title="Detected">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#6D756D]">
                  {shippingLocation
                    ? `✓ Destination: ${shippingLocation.city}, ${shippingLocation.state} (${cartShipping.zoneLabel})`
                    : `Parcel Weight: ~${cartShipping.totalGrams}g • Dispatch Origin: Punjab (Sirhind)`}
                </p>
              </div>

              {/* Price Details */}
              <div className="space-y-2 pt-1 text-xs text-[#6D756D]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-[#193428]">{formatCurrency(subtotal)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-[#356B49] font-bold">
                    <span>Catalog Discount</span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#356B49] font-bold">
                    <span>Promo Discount (10%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6D756D]">
                  <span>Free Gift Pouch</span>
                  <span className="font-bold text-[#356B49]">
                    {amountToFreePouch === 0 ? 'Unlocked (₹0)' : 'Eligible above ₹1,999'}
                  </span>
                </div>

                {/* FR-7: Speed Post Delivery Line Item */}
                <div className="flex justify-between items-center py-1 border-t border-dashed border-[#E7DFD2]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-[#193428]">Speed Post Delivery</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#244537]/10 text-[#244537]">
                      {cartShipping.zoneLabel} • ~{cartShipping.totalGrams}g
                    </span>
                  </div>
                  <span className="text-[#244537] font-bold">
                    {formatCurrency(deliveryCharge)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E7DFD2] flex justify-between text-base font-bold text-[#193428]">
                  <div>
                    <span>Total Amount</span>
                    <p className="text-[10px] text-[#6D756D] font-normal">Products + Speed Post Postage</p>
                  </div>
                  <span className="text-xl font-black text-[#244537]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Mandated Delivery Note */}
              <div className="p-3 rounded-2xl bg-[#F0EBE1] border border-[#E7DFD2] text-[11px] text-[#6D756D] leading-relaxed flex items-start space-x-2">
                <Truck className="w-4 h-4 text-[#244537] shrink-0 mt-0.5" />
                <span>
                  <strong>Speed Post Guaranteed:</strong> Exact postage auto-calculated per India Post tariffs. No surprise courier charges on WhatsApp.
                </span>
              </div>

              {/* Checkout CTA (Desktop) */}
              <button
                id="cart-page-checkout-cta"
                onClick={handleProceedCheckout}
                className="hidden md:flex w-full h-12 py-3.5 px-4 rounded-full bg-[#244537] hover:bg-[#193428] text-[#FFFFFF] font-bold text-xs uppercase tracking-wider shadow-md transition-all items-center justify-center space-x-2 active:scale-98 cursor-pointer border border-[#193428]"
              >
                <span>Proceed to Shipping & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="w-full text-center text-xs font-bold text-[#244537] hover:text-[#193428] hover:underline cursor-pointer"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Checkout Bar (Pinned above bottom tab bar) */}
      <div className="fixed bottom-15 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E7DFD2] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(25,52,40,0.08)] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase font-bold text-[#6D756D] tracking-wider truncate">Total Payable</p>
          <span className="text-[18px] font-black text-[#193428] leading-tight">
            {formatCurrency(finalTotal)}
          </span>
        </div>

        <button
          onClick={handleProceedCheckout}
          className="h-11 px-5 rounded-full bg-[#244537] hover:bg-[#193428] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center space-x-1.5 border border-[#193428] cursor-pointer"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
