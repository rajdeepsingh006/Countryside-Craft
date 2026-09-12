import React, { useState } from 'react';
import { Heart, Sparkles, Truck, ShieldCheck, MessageCircle, Send, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppInquiryMessage, generateWhatsAppUrl } from '../../utils/whatsappMessageBuilder';

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
    <footer className="bg-[#141926] text-[#E8ECF5] pt-16 pb-12 border-t border-[#252E42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-[#252E42]">
          {[
            { icon: <Sparkles className="w-5 h-5" />, color: 'text-[#DBE586]', bg: 'bg-[#DBE586]/10 border-[#DBE586]/30', title: 'Handcrafted Batches', desc: 'Heritage block prints with non-toxic botanical dyes' },
            { icon: <Truck className="w-5 h-5" />, color: 'text-[#B9C9E7]', bg: 'bg-[#B9C9E7]/10 border-[#B9C9E7]/30', title: '48-Hour Dispatch', desc: 'Safe packaging across India with live WhatsApp tracking' },
            { icon: <ShieldCheck className="w-5 h-5" />, color: 'text-[#EFC0DA]', bg: 'bg-[#EFC0DA]/10 border-[#EFC0DA]/30', title: 'Premium Canvas Quality', desc: 'Reinforced cross-stitching tested to hold 12+ kg' },
            { icon: <MessageCircle className="w-5 h-5" />, color: 'text-[#D91680]', bg: 'bg-[#D91680]/10 border-[#D91680]/30', title: 'WhatsApp Direct Support', desc: 'Instant order coordination & custom bulk gifting assistance' },
          ].map(({ icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-start space-x-3.5">
              <div className={`p-2.5 rounded-xl ${bg} ${color} border shrink-0`}>{icon}</div>
              <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-xs text-[#9AA5BE] mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="my-12 py-8 px-6 sm:px-10 rounded-3xl bg-gradient-to-r from-[#1B2234] via-[#21293F] to-[#1B2234] border border-[#B9C9E7]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DBE586] font-mono">
              Artisan Journal
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white mt-1">
              Receive First Access to Limited Edition Block Prints
            </h3>
            <p className="text-xs sm:text-sm text-[#AAB5CE] mt-1.5">
              Subscribe for workshop invites, new botanical print releases, and exclusive seasonal gift bundle promotions.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F131D] border border-[#374462] text-sm text-white placeholder-[#7885A3] focus:outline-none focus:border-[#D91680]"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-md active:scale-95 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 pb-12 border-b border-[#252E42]">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D91680] text-white flex items-center justify-center font-brand-script font-bold text-lg border border-[#EFC0DA]">
                CC
              </div>
              <span className="font-brand-script text-2xl sm:text-3xl tracking-wide text-white">
                Countryside Craft
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#9CAAC5] leading-relaxed max-w-sm">
              We design and handcraft premium printed canvas tote bags celebrating timeless Indian block printing, botanical motifs, and sustainable slow living. Every tote is cut, stitched, and printed in small artisan batches.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-[#7B8AA8]">
              <span className="inline-flex items-center space-x-1 font-medium">
                <span>Handcrafted with</span>
                <Heart className="w-3.5 h-3.5 text-[#D91680] fill-[#D91680]" />
                <span>in India</span>
              </span>
            </div>
          </div>

          {/* Explore Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#DBE586]">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#9CAAC5]">
              {[['Home', 'home'], ['Shop All Totes', 'products'], ['Workshop Gallery', 'gallery'], ['Our Craft Story', 'about']].map(([label, view]) => (
                <li key={view}>
                  <button onClick={() => onNavigate(view)} className="hover:text-white transition-colors cursor-pointer">
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-1.5">
                <button
                  onClick={() => openWhatsApp('custom-bulk')}
                  className="text-[#D91680] hover:text-white hover:bg-[#D91680] transition-all font-bold cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D91680]/15 border border-[#D91680]/40 shadow-xs active:scale-95"
                >
                  <span>Custom Bulk Gifting</span>
                  <span className="text-xs font-black">↗</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Studio & Inquiries Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#DBE586]">Studio & Inquiries</h4>
            <div className="space-y-2.5 text-xs text-[#9CAAC5]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#DBE586] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#DBE586] shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#DBE586] shrink-0" />
                <span>+{settings.whatsappNumber}</span>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp('general')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold border border-[#25D366]/40 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707E9D] gap-4">
          <p>© {new Date().getFullYear()} Countryside Craft. All rights reserved. Prices exclude delivery.</p>
          <div className="flex items-center space-x-6">
            <button
              id="footer-admin-link"
              onClick={() => onNavigate('admin-login')}
              className="text-[#B9C9E7] hover:text-white transition-colors underline cursor-pointer"
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
