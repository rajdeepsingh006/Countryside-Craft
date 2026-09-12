import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, ArrowRight, Package, Calendar, Phone, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

export const OrderConfirmationPage = ({ orderId, onNavigate }) => {
  const { settings } = useStore();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B9C9E7', '#DBE586', '#EFC0DA', '#D91680'],
      });
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId]);

  const handleReopenWhatsApp = () => {
    const defaultMsg = `Namaste Countryside Craft! 👋 I am following up on my order #${orderId || 'NEW'}. Please let me know the delivery timeframe and payment details. Thank you!`;
    const url = generateWhatsAppUrl(settings.whatsappNumber, defaultMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 shadow-sm p-6 sm:p-10 space-y-8 text-center sm:text-left">
          
          {/* Header Badge & Title */}
          <div className="text-center space-y-3 pb-6 border-b border-[#EEF3FA]">
            <div className="w-16 h-16 rounded-3xl bg-[#DBE586]/30 text-[#343C05] mx-auto flex items-center justify-center shadow-inner border border-[#DBE586]">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#D91680] bg-[#FDF1F7] px-3 py-1 rounded-full border border-[#EFC0DA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Received Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#6A758E] max-w-md mx-auto">
              Your order has been recorded in our workshop system. Please complete payment and delivery coordination via WhatsApp.
            </p>
          </div>

          {/* Order Details & Summary Box */}
          <div className="p-5 rounded-2xl bg-[#EEF3FA]/40 border border-[#B9C9E7]/60 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#B9C9E7]/40 gap-2">
              <div>
                <span className="text-[#6A758E] block">Order Identifier:</span>
                <span className="font-mono font-bold text-sm text-[#D91680]">
                  #{orderId || 'CONFIRMED'}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[#6A758E] block">Order Placed:</span>
                <span className="font-bold text-[#1A1F2C]">{formatDate(new Date())}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-[#1A1F2C] uppercase tracking-wider text-[11px]">
                Order Coordination
              </h4>
              <p className="text-[#3E475C]">
                Our artisan support team has received your order on WhatsApp. We will reply to your chat within a few minutes with payment details (UPI/QR) and calculated shipping.
              </p>
            </div>
          </div>

          {/* WhatsApp Reopen Action Banner */}
          <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#1A1F2C] space-y-3">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs">Need to chat with us again on WhatsApp?</h4>
                <p className="text-[11px] text-[#4B566E] mt-0.5 leading-relaxed">
                  If WhatsApp did not automatically open on your device, click the button below to open the chat directly with our team.
                </p>
              </div>
            </div>

            <button
              onClick={handleReopenWhatsApp}
              className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Open WhatsApp Chat for Order #{orderId}</span>
            </button>
          </div>

          {/* Continue button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#D91680] hover:underline cursor-pointer"
            >
              ← Continue Browsing Other Handcrafted Goods
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
