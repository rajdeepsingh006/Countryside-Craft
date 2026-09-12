import React, { useState } from 'react';
import { MessageCircle, ShieldCheck, ArrowRight, Gift, Lock, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { buildWhatsAppOrderMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';
import { CustomerInfo, OrderItemSnapshot } from '../types';

interface CheckoutPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, clearCart, totalItems } = useCart();
  const { createOrder, settings, showToast } = useStore();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    note: '',
    giftWrap: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'WhatsApp mobile number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN code is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      // Build order items snapshot
      const itemsSnapshot: OrderItemSnapshot[] = cart.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        selectedColor: item.selectedColor
      }));

      // Create order in store
      const order = createOrder({
        customer: {
          ...formData,
          phone: formData.phone.replace(/[^0-9]/g, '')
        },
        items: itemsSnapshot,
        subtotal,
        discount: 0,
        totalAmount: subtotal,
        shippingNote: 'Delivery charges confirmed via WhatsApp based on exact PIN code',
        status: 'pending',
        whatsappMessageSent: true,
        whatsappUrl: ''
      });

      // Build structured WhatsApp message
      const whatsappMsg = buildWhatsAppOrderMessage(order, settings.storeName);
      const whatsappUrl = generateWhatsAppUrl(settings.whatsappNumber, whatsappMsg);

      // Open WhatsApp click-to-chat
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Clear local shopping bag
      clearCart();

      // Navigate to order confirmation
      setTimeout(() => {
        setIsSubmitting(false);
        onNavigate('order-confirmation', order._id);
      }, 500);

    } catch (err) {
      console.error('Order creation error:', err);
      setIsSubmitting(false);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="text-xl font-bold text-[#2A241E]">No items in your cart to checkout</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 px-6 py-2.5 bg-[#8C5E3C] text-white rounded-xl text-xs font-bold uppercase"
        >
          Browse Tote Bags
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 pb-4 border-b border-[#E5DAC8]">
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#27211A]">
            Checkout & WhatsApp Confirmation
          </h1>
          <p className="text-xs text-[#786B5A] mt-1">
            Provide your delivery details below. You will be redirected to WhatsApp to confirm and finalize payment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Customer Shipping Form Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact & WhatsApp */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-xs space-y-4">
              <h3 className="font-serif-display font-bold text-base text-[#241F18] flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#8C5E3C] text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>Customer Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B3329] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border text-[#241F18] focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-[#D5C7B2] focus:border-[#8C5E3C]'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B3329] mb-1 flex items-center justify-between">
                    <span>WhatsApp Mobile Number *</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">For Order Chat</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7E6E] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98765 43210"
                      className={`w-full pl-11 pr-3 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border text-[#241F18] focus:outline-none ${
                        errors.phone ? 'border-red-500' : 'border-[#D5C7B2] focus:border-[#8C5E3C]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B3329] mb-1">
                  Email Address (Optional - for order receipt)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="radhika@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-xs space-y-4">
              <h3 className="font-serif-display font-bold text-base text-[#241F18] flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#8C5E3C] text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>Shipping / Delivery Address</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#3B3329] mb-1">
                  Street Address, Flat / House No, Landmark *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat 402, Lotus Heritage, 12th Main Road, Near Park"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border text-[#241F18] focus:outline-none resize-none ${
                    errors.address ? 'border-red-500' : 'border-[#D5C7B2] focus:border-[#8C5E3C]'
                  }`}
                />
                {errors.address && <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3B3329] mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bangalore"
                    className={`w-full px-3 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border text-[#241F18] focus:outline-none ${
                      errors.city ? 'border-red-500' : 'border-[#D5C7B2] focus:border-[#8C5E3C]'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B3329] mb-1">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B3329] mb-1">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="560038"
                    className={`w-full px-3 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border text-[#241F18] focus:outline-none ${
                      errors.pincode ? 'border-red-500' : 'border-[#D5C7B2] focus:border-[#8C5E3C]'
                    }`}
                  />
                  {errors.pincode && <p className="text-[10px] text-red-600 mt-1">{errors.pincode}</p>}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#3B3329] mb-1">
                  Special Delivery Instructions / Custom Monogram Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. Please leave package at security / Call on arrival"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#D5C7B2] text-[#241F18] focus:outline-none focus:border-[#8C5E3C]"
                />
              </div>

              {/* Gift Wrapping Toggle */}
              <label className="flex items-center space-x-2.5 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.giftWrap}
                  onChange={(e) => setFormData({ ...formData, giftWrap: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8C5E3C] accent-[#8C5E3C]"
                />
                <span className="text-xs text-[#4A4033] font-medium flex items-center space-x-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#8C5E3C]" />
                  <span>This is a gift — Please pack in handmade butter paper with jute ribbon</span>
                </span>
              </label>

            </div>

          </div>

          {/* Order Summary & WhatsApp Action Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-3xl bg-white border border-[#E8DFD0] shadow-sm space-y-4">
              <h3 className="font-serif-display font-bold text-base text-[#241F18] pb-3 border-b border-[#F2ECE1]">
                Order Items ({totalItems})
              </h3>

              {/* Items recap */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg bg-[#F5EFE6] border border-[#E0D5C3] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#241F18] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[#7A6D5C] text-[11px]">
                        Qty: {item.quantity} × {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <span className="font-bold text-[#241F18]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-[#F2ECE1] space-y-2 text-xs text-[#52483B]">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-medium text-[#241F18]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-[#8C5E3C] font-semibold">Confirmed via WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-[#E8DFD0] flex justify-between text-base font-bold text-[#241F18]">
                  <span>Total (Excl. Shipping)</span>
                  <span className="text-xl text-[#8C5E3C]">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Mandated Note Directly Below Checkout Button (FR-11 & FR-12) */}
              <div className="space-y-2 pt-2">
                <button
                  id="place-order-whatsapp-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>
                    {isSubmitting ? 'Saving Order...' : `Proceed to WhatsApp (${formatCurrency(subtotal)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* PRD Mandated Note */}
                <p className="text-[11px] text-[#736553] text-center leading-relaxed px-1 font-medium">
                  ✦ Clicking this button will save your order in our database and redirect you to WhatsApp with your pre-filled order details to coordinate payment & final shipping.
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-center space-x-4 text-[11px] text-[#8C7E6C]">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>Direct Artisan Handshake</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Truck className="w-3 h-3 text-[#8C5E3C]" />
                  <span>Pan-India Courier</span>
                </span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
