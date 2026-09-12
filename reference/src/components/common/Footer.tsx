import React, { useState } from 'react';
import { Heart, Sparkles, Truck, ShieldCheck, RefreshCw, Send, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('✨ Thank you for joining our artisan circle! Check your inbox soon.', 'success');
    setEmailInput('');
  };

  const openWhatsAppHelp = (topic = 'general') => {
    const msg = buildWhatsAppInquiryMessage(topic);
    const url = generateWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#24211D] text-[#EFEBE4] pt-16 pb-12 border-t border-[#3A352E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip (Wedtree inspired) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#3D372F]">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-[#332E27] text-amber-300 border border-[#4D453A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F7F3EC]">Handcrafted Batches</h4>
              <p className="text-xs text-[#A89D8D] mt-0.5">Heritage block prints with non-toxic botanical dyes</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-[#332E27] text-emerald-300 border border-[#4D453A]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F7F3EC]">48-Hour Dispatch</h4>
              <p className="text-xs text-[#A89D8D] mt-0.5">Safe packaging across India with live WhatsApp tracking</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-[#332E27] text-amber-200 border border-[#4D453A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F7F3EC]">450 GSM Heavy Canvas</h4>
              <p className="text-xs text-[#A89D8D] mt-0.5">Reinforced cross-stitching tested to hold 12+ kg</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-lg bg-[#332E27] text-sky-300 border border-[#4D453A]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#F7F3EC]">WhatsApp Direct Support</h4>
              <p className="text-xs text-[#A89D8D] mt-0.5">Instant order coordination & custom bulk gifting assistance</p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Band */}
        <div className="my-12 py-8 px-6 sm:px-10 rounded-2xl bg-gradient-to-r from-[#302B24] to-[#2B2721] border border-[#443C31] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/90 font-mono">
              Artisan Journal
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-display font-medium text-[#FAF6F0] mt-1">
              Receive First Access to Limited Edition Block Prints
            </h3>
            <p className="text-xs sm:text-sm text-[#B8ACA0] mt-1.5">
              Subscribe for workshop invites, new botanical print releases, and exclusive seasonal gift bundle promotions.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#1E1B17] border border-[#473E32] text-sm text-[#F5F0E8] placeholder-[#7E7465] focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-md active:scale-95"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Footer Links & Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-4 pb-12 border-b border-[#352F28]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#423D35] text-[#E8DCC4] flex items-center justify-center font-brand font-bold text-lg border border-[#5E5649]">
                V
              </div>
              <span className="font-brand font-bold text-2xl tracking-[0.16em] text-[#FAF6F0]">
                VANA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#B0A595] leading-relaxed max-w-sm">
              We design and handcraft premium printed canvas tote bags celebrating timeless Indian block printing, botanical motifs, and sustainable slow living. Every tote is cut, stitched, and printed in small artisan batches.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-[#8F8271]">
              <span className="inline-flex items-center space-x-1">
                <span>Handcrafted with</span>
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>in India</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6DDCF]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A89D8D]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#FAF6F0] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#FAF6F0] transition-colors">
                  All Tote Bags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#FAF6F0] transition-colors">
                  Workshop & Events Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#FAF6F0] transition-colors">
                  Our Craft & Dyes
                </button>
              </li>
              <li>
                <button onClick={() => openWhatsAppHelp('custom-bulk')} className="text-amber-300/90 hover:text-amber-200 transition-colors font-medium">
                  Custom Bulk Gifting ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6DDCF]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A89D8D]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <button
                    onClick={() => onNavigate('products', cat.slug)}
                    className="hover:text-[#FAF6F0] transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E6DDCF]">
              Studio & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-[#A89D8D]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#8C5E3C] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#8C5E3C] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </div>
            </div>

            <button
              onClick={() => openWhatsAppHelp('general')}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 text-xs font-medium border border-emerald-700/50 flex items-center justify-center space-x-2 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright & Admin portal link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A7061] gap-4">
          <p>© {new Date().getFullYear()} VANA Artisan Tote Co. All rights reserved. Prices exclude delivery.</p>
          <div className="flex items-center space-x-6">
            <button
              id="footer-admin-link"
              onClick={() => onNavigate('admin-dashboard')}
              className="text-[#A89D8D] hover:text-amber-200 transition-colors underline underline-offset-2"
            >
              Business Admin Panel
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-[#FAF6F0] transition-colors">
              Craft Story
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('gallery')} className="hover:text-[#FAF6F0] transition-colors">
              Workshops
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
