import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

export const WhatsAppFloating: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSendPrompt = (topic?: string) => {
    const text = customMsg.trim() ? customMsg : buildWhatsAppInquiryMessage(topic);
    const url = generateWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Interactive Popup Box */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#FCFAF6] rounded-2xl shadow-2xl border border-[#DECDB8] p-4 text-[#2E2922] animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2E2922]">VANA Artisan Helpdesk</h4>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Quick Response</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-[#887C6C] hover:bg-[#EFE8DC] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <p className="text-xs text-[#524B40] leading-relaxed">
              Namaste! 🙏 How can we assist you with our handcrafted printed totes today?
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => handleSendPrompt('general')}
                className="w-full text-left p-2 rounded-lg bg-[#F5EFE4] hover:bg-[#EAE0D0] text-xs font-medium text-[#423B30] border border-[#E0D4C2] transition-colors flex items-center justify-between"
              >
                <span>👜 Ask about fabric & sizing</span>
                <span className="text-[#8C5E3C]">→</span>
              </button>

              <button
                onClick={() => handleSendPrompt('custom-bulk')}
                className="w-full text-left p-2 rounded-lg bg-[#F5EFE4] hover:bg-[#EAE0D0] text-xs font-medium text-[#423B30] border border-[#E0D4C2] transition-colors flex items-center justify-between"
              >
                <span>✨ Custom bulk / wedding orders</span>
                <span className="text-[#8C5E3C]">→</span>
              </button>

              <button
                onClick={() => handleSendPrompt('order-track')}
                className="w-full text-left p-2 rounded-lg bg-[#F5EFE4] hover:bg-[#EAE0D0] text-xs font-medium text-[#423B30] border border-[#E0D4C2] transition-colors flex items-center justify-between"
              >
                <span>🚚 Track my current order</span>
                <span className="text-[#8C5E3C]">→</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8DFD0] flex items-center space-x-1.5">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white border border-[#D5C7B2] text-[#2E2922] focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={() => handleSendPrompt()}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-sans tracking-wide pr-1">
          Chat on WhatsApp
        </span>
      </button>

    </div>
  );
};
