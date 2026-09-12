import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, ArrowRight, Package, Calendar, Phone, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { buildWhatsAppOrderMessage, generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const { orders, settings } = useStore();

  const order = orders.find((o) => o._id === orderId || o.orderNumber === orderId) || orders[0];

  useEffect(() => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId]);

  if (!order) {
    return (
      <div className="py-20 text-center bg-[#FAF7F2]">
        <h2 className="text-xl font-bold text-[#2A241E]">Order not found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-2.5 bg-[#8C5E3C] text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleReopenWhatsApp = () => {
    const msg = buildWhatsAppOrderMessage(order, settings.storeName);
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#E8DFD0] shadow-sm p-6 sm:p-10 space-y-8 text-center sm:text-left">
          
          {/* Header Badge & Title */}
          <div className="text-center space-y-3 pb-6 border-b border-[#F2ECE1]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] bg-[#EFE7D8] px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Received Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#241F18]">
              Thank You, {order.customer.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#736553] max-w-md mx-auto">
              Your order has been recorded in our workshop system. Please complete payment and delivery coordination via WhatsApp.
            </p>
          </div>

          {/* Order Details & Summary Box */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5 DAC8] space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DFD0] gap-2">
              <div>
                <span className="text-[#8C7E6C] block">Order Number:</span>
                <span className="font-mono font-bold text-sm text-[#8C5E3C]">
                  #{order.orderNumber}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[#8C7E6C] block">Order Placed:</span>
                <span className="font-semibold text-[#241F18]">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#241F18] uppercase tracking-wider text-[11px]">
                Ordered Items
              </h4>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded-lg bg-white border border-[#D5C7B2]"
                    />
                    <div>
                      <span className="font-semibold text-[#241F18] block">{item.name}</span>
                      <span className="text-[#8C7E6C] text-[11px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#241F18]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery address */}
            <div className="pt-3 border-t border-[#E8DFD0] space-y-1">
              <h4 className="font-bold text-[#241F18] uppercase tracking-wider text-[11px]">
                Delivery Address
              </h4>
              <p className="text-[#4E4437]">
                {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
              <p className="text-[#7A6D5C] pt-1">
                WhatsApp Phone: +91 {order.customer.phone}
              </p>
              {order.customer.note && (
                <p className="italic text-[#8C5E3C] pt-1">
                  Note: "{order.customer.note}"
                </p>
              )}
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#E8DFD0] flex justify-between text-sm font-bold text-[#241F18]">
              <span>Total Product Amount</span>
              <span className="text-base text-[#8C5E3C]">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* WhatsApp Reopen Action Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">Need to chat with us again on WhatsApp?</h4>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  If WhatsApp did not automatically open on your device, click the button below to send your order details directly to our artisan team.
                </p>
              </div>
            </div>

            <button
              onClick={handleReopenWhatsApp}
              className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Open WhatsApp Chat for Order #{order.orderNumber}</span>
            </button>
          </div>

          {/* Continue button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#8C5E3C] hover:underline"
            >
              ← Continue Browsing Other Handcrafted Goods
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
