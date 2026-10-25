import React, { useState } from 'react';
import { Heart, Sparkles, Truck, ShieldCheck, MessageCircle, Send, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';
import { getAssetUrl } from '../../utils/assetHelper';

export const Footer = ({ onNavigate }) => {
  const { settings, categories, showToast } = useStore();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('✨ Thank you for joining our artisan circle! Check your inbox soon.', 'success');
    setEmailInput('');
  };

  const openWhatsApp = (topic = 'general') => {
    const msg = buildWhatsAppInquiryMessage(topic);
    window.open(generateWhatsAppUrl(settings.whatsappNumber, msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-[#193428] text-[#F8F5EF] pt-16 pb-28 md:pb-12 border-t border-[#244537] texture-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#244537]">
          {[
            {
              icon: <Sparkles className="w-5 h-5" />,
              color: 'text-[#C6A46A]',
              bg: 'bg-[#244537]/60 border-[#C6A46A]/30',
              title: 'Handcrafted Batches',
              desc: 'Heritage block prints with non-toxic botanical dyes',
            },
            {
              icon: <Truck className="w-5 h-5" />,
              color: 'text-[#F8F5EF]',
              bg: 'bg-[#244537]/60 border-[#E7DFD2]/25',
              title: 'India Post Speed Post',
              desc: 'Fast, verified dispatch across India with tracking',
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              color: 'text-[#C6A46A]',
              bg: 'bg-[#244537]/60 border-[#C6A46A]/30',
              title: 'Pure Cotton Canvas',
              desc: 'Reinforced cross-stitching tested to hold 12+ kg',
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              color: 'text-[#4ADE80]',
              bg: 'bg-[#244537]/60 border-[#4ADE80]/30',
              title: 'WhatsApp Concierge',
              desc: 'Instant order coordination & custom bulk gifting assistance',
            },
          ].map(({ icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-start space-x-3.5">
              <div className={`p-2.5 rounded-xl ${bg} ${color} border shrink-0`}>{icon}</div>
              <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-xs text-[#A3B1A9] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="my-12 py-8 px-6 sm:px-10 rounded-3xl bg-gradient-to-r from-[#244537] via-[#1E3A2E] to-[#244537] border border-[#C6A46A]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl texture-canvas">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A46A] font-mono">
              Artisan Journal
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mt-1">
              Receive First Access to Limited Edition Botanical Prints
            </h3>
            <p className="text-xs sm:text-sm text-[#D3DDD7] mt-1.5">
              Subscribe for workshop invites, new botanical releases, and exclusive seasonal gift bundle promotions.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#193428] border border-[#244537] text-sm text-[#F8F5EF] placeholder-[#8A9A90] focus:outline-none focus:border-[#C6A46A]"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#A94F2B] hover:bg-[#8F4021] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-md active:scale-98 cursor-pointer border border-[#A94F2B]"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 pb-12 border-b border-[#244537]">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border border-[#E7DFD2] p-0.5 shrink-0 flex items-center justify-center">
                <img
                  src={getAssetUrl('/images/logo.jpg')}
                  alt="Countryside Craft Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-brand-script text-2xl sm:text-3xl tracking-wide text-white leading-none">
                  Countryside Craft
                </span>
                <span className="text-[10px] text-[#C6A46A] font-mono tracking-widest uppercase mt-0.5">
                  By Rupinder • Sirhind, Punjab
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A3B1A9] leading-relaxed max-w-sm">
              We design and handcraft premium printed canvas tote bags celebrating timeless Indian block printing, botanical motifs, and sustainable slow living. Every tote is cut, stitched, and printed in small artisan batches.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-[#8A9A90]">
              <span className="inline-flex items-center space-x-1 font-medium">
                <span>Handcrafted with</span>
                <Heart className="w-3.5 h-3.5 text-[#A94F2B] fill-[#A94F2B]" />
                <span>in India</span>
              </span>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A46A]">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D3DDD7]">
              {[
                ['Home', 'home'],
                ['Shop All Totes', 'products'],
                ['Workshop Gallery', 'gallery'],
                ['Our Craft Story', 'about'],
              ].map(([label, view]) => (
                <li key={view}>
                  <button
                    onClick={() => onNavigate(view)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-1.5">
                <button
                  onClick={() => openWhatsApp('custom-bulk')}
                  className="text-[#C6A46A] hover:text-[#193428] hover:bg-[#C6A46A] transition-all font-bold cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#C6A46A]/10 border border-[#C6A46A]/40 shadow-xs active:scale-98"
                >
                  <span>Custom Bulk Gifting</span>
                  <span className="text-xs font-black">↗</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Studio & Inquiries Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A46A]">Studio & Inquiries</h4>
            <div className="space-y-2.5 text-xs text-[#D3DDD7]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C6A46A] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C6A46A] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C6A46A] shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp('general')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#4ADE80] text-xs font-bold border border-[#25D366]/40 flex items-center justify-center space-x-2 transition-colors cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A9A90] gap-4">
          <p>© {new Date().getFullYear()} Countryside Craft. All rights reserved. Speed Post delivery calculated at checkout.</p>
          <div className="flex items-center space-x-6">
            <button
              id="footer-admin-link"
              onClick={() => onNavigate('admin-login')}
              className="text-[#C6A46A] hover:text-white transition-colors underline cursor-pointer"
            >
              Business Admin Panel
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
              About
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors cursor-pointer">
              Gallery
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
