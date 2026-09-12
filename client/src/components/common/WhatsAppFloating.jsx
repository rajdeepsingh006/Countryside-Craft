import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

export const WhatsAppFloating = ({ currentView }) => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const isCheckoutOrCart = currentView === 'cart' || currentView === 'checkout' || currentView === 'order-confirmation';
  const hasStickyConversionBar = currentView === 'product-detail';

  const positionClasses = isCheckoutOrCart
    ? 'hidden md:flex bottom-6 right-6'
    : hasStickyConversionBar
    ? 'flex bottom-30 right-4 md:bottom-6 md:right-6'
    : 'flex bottom-20 right-4 md:bottom-6 md:right-6';

  const handleSend = (topic) => {
    const text = customMsg.trim() ? customMsg : buildWhatsAppInquiryMessage(topic);
    const url = generateWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className={`fixed z-45 flex-col items-end ${positionClasses}`}>
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white rounded-3xl shadow-2xl border border-[#B9C9E7]/60 p-4 text-[#1A1F2C]">
          <div className="flex items-center justify-between pb-3 border-b border-[#B9C9E7]/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1F2C]">Countryside Craft Helpdesk</h4>
                <p className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>Online · Quick Response</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#6A758E] hover:bg-[#EEF3FA] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <p className="text-xs text-[#3E475C] leading-relaxed">
              Namaste! 🙏 How can we assist you with our handcrafted printed totes today?
            </p>
            <div className="space-y-1.5 pt-1">
              {[
                { label: '👜 Ask about fabric & sizing', topic: 'general' },
                { label: '✨ Custom bulk / wedding orders', topic: 'custom-bulk' },
                { label: '🚚 Track my current order', topic: 'order-track' },
              ].map(({ label, topic }) => (
                <button
                  key={topic}
                  onClick={() => handleSend(topic)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#EEF3FA]/50 hover:bg-[#EEF3FA] text-xs font-semibold text-[#1A1F2C] border border-[#B9C9E7]/50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{label}</span>
                  <span className="text-[#D91680] font-black">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#B9C9E7]/40 flex items-center space-x-1.5">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#EEF3FA]/30 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80 cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold tracking-wide pr-1">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
};
