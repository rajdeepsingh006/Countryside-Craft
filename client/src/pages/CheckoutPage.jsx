import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, ArrowRight, Lock, Truck, MapPin, Phone, Building, Home, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { orderService } from '../services/orderService';
import { buildWhatsAppOrderMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

export const CheckoutPage = ({ onNavigate }) => {
  const { cart, subtotal, clearCart, totalItems } = useCart();
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    landmark: '',
    addressType: 'Home',
    city: '',
    state: 'Punjab',
    pincode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const INDIAN_STATES = [
    'Punjab', 'Haryana', 'Delhi', 'Rajasthan', 'Uttar Pradesh', 'Himachal Pradesh',
    'Chandigarh', 'Jammu & Kashmir', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
    'Telangana', 'Andhra Pradesh', 'Gujarat', 'West Bengal', 'Kerala', 'Madhya Pradesh',
    'Bihar', 'Odisha', 'Assam', 'Goa', 'Uttarakhand', 'Jharkhand', 'Chhattisgarh',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'WhatsApp mobile number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) errs.address = 'House/Flat no. & Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN code is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill all required shipping fields correctly.', 'warning');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      onNavigate('products');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      // Combined full address with landmark and address type
      const fullAddress = `${formData.address}${
        formData.landmark ? `, Landmark: ${formData.landmark}` : ''
      } (${formData.addressType}), ${formData.city}, ${formData.state} - ${formData.pincode}`;

      const customerPayload = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/[^0-9]/g, ''),
        address: fullAddress,
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.trim(),
        email: formData.email.trim(),
        note: formData.altPhone ? `Alt Phone: ${formData.altPhone}` : '',
      };

      const response = await orderService.createOrder({
        customer: customerPayload,
        items: itemsPayload,
      });

      const orderResult = response.order || response;
      const orderNumber = orderResult.orderNumber || `ORD-${Date.now().toString().slice(-5)}`;
      let finalWhatsappUrl = response.whatsappUrl;

      // Fallback builder if not provided
      if (!finalWhatsappUrl) {
        const orderSnapshot = {
          orderNumber,
          createdAt: new Date().toISOString(),
          customer: { ...formData, address: fullAddress },
          items: cart.map((i) => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
          subtotal,
          discount: 0,
          totalAmount: subtotal,
        };
        const whatsappMsg = buildWhatsAppOrderMessage(orderSnapshot, settings.storeName);
        finalWhatsappUrl = generateWhatsAppUrl(settings.whatsappNumber, whatsappMsg);
      }

      // Open WhatsApp
      window.open(finalWhatsappUrl, '_blank', 'noopener,noreferrer');

      // Clear cart
      await clearCart();

      // Navigate to order confirmation
      setTimeout(() => {
        setIsSubmitting(false);
        onNavigate('order-confirmation', orderNumber);
      }, 500);
    } catch (err) {
      console.error('Order creation error:', err);
      setIsSubmitting(false);
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FCFBFA]">
        <h2 className="text-xl font-bold text-[#1A1F2C]">No items in your cart to checkout</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 px-6 py-2.5 bg-[#D91680] text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
        >
          Browse Tote Bags
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 pb-4 border-b border-[#B9C9E7]/40">
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
            Shipping & WhatsApp Order Confirmation
          </h1>
          <p className="text-xs text-[#6A758E] mt-1">
            Enter your destination delivery address below. You will be redirected to WhatsApp to coordinate final shipping & payment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Customer Shipping Form Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Step 1: Customer Contact & WhatsApp */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-2xs space-y-4">
              <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C] flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#D91680] text-white text-xs flex items-center justify-center font-sans font-bold shadow-xs">
                  1
                </span>
                <span>Contact & Communication</span>
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    autoComplete="name"
                    className={`w-full px-3.5 py-3 text-xs rounded-xl bg-[#EEF3FA]/40 border text-[#1A1F2C] focus:outline-none min-h-[44px] ${
                      errors.name ? 'border-red-500' : 'border-[#B9C9E7] focus:border-[#D91680]'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1 flex items-center justify-between">
                    <span>WhatsApp Mobile Number *</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">For Order Updates</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#6A758E] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98765 43210"
                      className={`w-full pl-11 pr-3 py-3 text-xs rounded-xl bg-[#EEF3FA]/40 border text-[#1A1F2C] focus:outline-none min-h-[44px] ${
                        errors.phone ? 'border-red-500' : 'border-[#B9C9E7] focus:border-[#D91680]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1F2C] mb-1">
                    Alternate / Backup Contact Number (Optional)
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    placeholder="e.g. 98123 45678 (Optional)"
                    className="w-full px-3.5 py-3 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1F2C] mb-1">
                    Email Address (Optional - for order receipt)
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full px-3.5 py-3 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680] min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & Shipping Details */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-2xs space-y-4">
              <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#1A1F2C] flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#D91680] text-white text-xs flex items-center justify-center font-sans font-bold shadow-xs">
                  2
                </span>
                <span>Destination Shipping Address</span>
              </h3>

              {/* Address Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#1A1F2C] mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'Home', label: '🏠 Home (All Day)' },
                    { type: 'Office', label: '🏢 Office (10AM - 6PM)' },
                    { type: 'Other', label: '📦 Other' },
                  ].map(({ type, label }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, addressType: type })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                        formData.addressType === type
                          ? 'bg-[#D91680] text-white border-[#D91680] shadow-xs'
                          : 'bg-[#EEF3FA]/50 text-[#2C3549] border-[#B9C9E7] hover:bg-[#EEF3FA]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                  Flat / House / Building No. & Street Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Lotus Heritage, 12th Main Road"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border text-[#1A1F2C] focus:outline-none resize-none ${
                    errors.address ? 'border-red-500' : 'border-[#B9C9E7] focus:border-[#D91680]'
                  }`}
                />
                {errors.address && <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1F2C] mb-1">
                  Nearby Landmark / Area (Helps courier agent reach faster)
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Near Apollo Pharmacy / Behind City Center Mall"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ludhiana"
                    className={`w-full px-3 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border text-[#1A1F2C] focus:outline-none ${
                      errors.city ? 'border-red-500' : 'border-[#B9C9E7] focus:border-[#D91680]'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="141001"
                    className={`w-full px-3 py-2.5 text-xs rounded-xl bg-[#EEF3FA]/40 border text-[#1A1F2C] focus:outline-none ${
                      errors.pincode ? 'border-red-500' : 'border-[#B9C9E7] focus:border-[#D91680]'
                    }`}
                  />
                  {errors.pincode && <p className="text-[10px] text-red-600 mt-1">{errors.pincode}</p>}
                </div>
              </div>

            </div>

          </div>

          {/* Order Summary & WhatsApp Action Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-base text-[#1A1F2C] pb-3 border-b border-[#EEF3FA]">
                Order Items ({totalItems})
              </h3>

              {/* Items recap */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3 text-xs">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-xl bg-[#FAF7F2] border border-[#B9C9E7]/50 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-14 rounded-xl bg-gradient-to-br from-[#FAF6F0] to-[#EAE0D4] border border-[#E4D7C8] flex flex-col items-center justify-center text-center shrink-0 text-[#D91680]">
                        <Sparkles className="w-4 h-4 opacity-75" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1A1F2C] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[#6A758E] text-[11px]">
                        Qty: {item.quantity} × {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <span className="font-black text-[#1A1F2C]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-[#EEF3FA] space-y-2 text-xs text-[#3E475C]">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-bold text-[#1A1F2C]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-[#D91680] font-bold">Confirmed via WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-[#B9C9E7]/50 flex justify-between text-base font-bold text-[#1A1F2C]">
                  <span>Total (Excl. Shipping)</span>
                  <span className="text-xl font-black text-[#D91680]">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Checkout Button & Note */}
              <div className="space-y-2 pt-2">
                <button
                  id="place-order-whatsapp-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>
                    {isSubmitting ? 'Saving Order...' : `Proceed to WhatsApp (${formatCurrency(subtotal)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-[#6A758E] text-center leading-relaxed px-1 font-medium">
                  ✦ Clicking this button saves your order and redirects you to WhatsApp with your pre-filled order details to coordinate courier payment & delivery dispatch.
                </p>
              </div>

              <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-center space-x-4 text-[11px] text-[#6A758E]">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Direct Artisan Handshake</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Truck className="w-3 h-3 text-[#D91680]" />
                  <span>Pan-India Delivery</span>
                </span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
