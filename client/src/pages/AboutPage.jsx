import React, { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Leaf, MessageCircle, Send, Award, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateWhatsAppUrl } from '../utils/whatsappMessageBuilder';

export const AboutPage = ({ onNavigate }) => {
  const { settings, showToast } = useStore();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Wedding Favors & Gift Hampers');
  const [inquiryQuantity, setInquiryQuantity] = useState('50 - 100 Totes');
  const [inquiryNote, setInquiryNote] = useState('');

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      showToast('Please provide your name and contact phone number.', 'warning');
      return;
    }

    const message = `*Custom Bulk / Wedding Gifting Inquiry - Countryside Craft* 🌿\n\n*Name:* ${inquiryName}\n*Phone:* ${inquiryPhone}\n*Occasion/Type:* ${inquiryType}\n*Estimated Quantity:* ${inquiryQuantity}\n*Requirements:* ${inquiryNote || 'Looking for personalized tote bags with custom branding'}\n\nPlease share catalog pricing and delivery timeline.`;

    const url = generateWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Redirecting to WhatsApp to send your bulk inquiry...', 'success');
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Brand Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#D91680] bg-[#FDF1F7] px-3 py-1 rounded-full border border-[#EFC0DA]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Artisan Philosophy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1A1F2C] leading-tight">
              Rooted in Indian Heritage, Hand-Printed for Modern Slow Living.
            </h1>

            <p className="text-sm sm:text-base text-[#3E475C] leading-relaxed">
              <strong>Countryside Craft</strong> was founded with a singular mission: to celebrate timeless Indian textile printing traditions—specifically authentic hand block printing, natural dyes, and botanical motifs—crafted into heavyweight, everyday utilitarian canvas tote bags.
            </p>

            <p className="text-xs sm:text-sm text-[#6A758E] leading-relaxed">
              Every tote bag begins on 450 GSM pure unbleached organic cotton canvas. Hand-carved teakwood blocks are dipped into AZO-free earth pigments and hand-stamped by master craftsmen who have practiced this meditative art across generations.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-[#1A1F2C]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Biodegradable Heavy Canvas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fair Trade Wages to Artisans</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#B9C9E7]/60 bg-[#161C2A]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                alt="Artisan block printing in workshop"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-[#B9C9E7]/60 max-w-xs hidden sm:block">
              <p className="text-xs font-serif-display italic text-[#1A1F2C]">
                "A handmade tote bag carries not just your books and essentials, but the heartbeat of the artisan."
              </p>
              <span className="text-[10px] font-black text-[#D91680] mt-2 block uppercase tracking-wider">
                — Countryside Craft Artisans
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Craft Process */}
        <div className="py-12 border-y border-[#B9C9E7]/40">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D91680]">
              The Meditative Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
              How Each Countryside Craft Tote is Born
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Teakwood Carving',
                desc: 'Master carpenters carve intricate botanical floral and geometric motifs onto seasoned teakwood blocks using fine chisels.',
                accent: 'bg-[#B9C9E7]/30 text-[#1A3B70] border-[#B9C9E7]',
              },
              {
                num: '02',
                title: 'Botanical Inks & Resist',
                desc: 'Natural botanical extracts and mineral earth pigments are prepared in small batches for high colorfastness and rich earthy hues.',
                accent: 'bg-[#DBE586]/40 text-[#343C05] border-[#DBE586]',
              },
              {
                num: '03',
                title: 'Solar Sun Curing',
                desc: 'Freshly printed fabric lengths are washed in clear water and sun-cured to permanently set the natural colors into the canvas fiber.',
                accent: 'bg-[#EFC0DA]/40 text-[#86124F] border-[#EFC0DA]',
              },
              {
                num: '04',
                title: 'Precision Tailoring',
                desc: 'Heavyweight 450 GSM canvas is cut and tailored with reinforced cross-box handle stitching, brass hardware, and internal security pockets.',
                accent: 'bg-[#EEF3FA] text-[#1A1F2C] border-[#B9C9E7]',
              },
            ].map((step) => (
              <div key={step.num} className="p-6 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-3">
                <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center border ${step.accent}`}>
                  {step.num}
                </span>
                <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                  {step.title}
                </h3>
                <p className="text-xs text-[#525E77] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Bulk & Wedding Favors Inquiry Section */}
        <div className="bg-white rounded-3xl border border-[#B9C9E7]/50 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#D91680] bg-[#FDF1F7] px-3 py-1 rounded-full border border-[#EFC0DA]">
                <Award className="w-3.5 h-3.5" />
                <span>Celebration & Corporate Gifting</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
                Customized Wedding Favors & Corporate Hampers
              </h2>
              <p className="text-xs sm:text-sm text-[#525E77] leading-relaxed">
                Create memorable, sustainable return gifts for Indian weddings, baby showers, or corporate brand summits. We support custom name tags, gold foil monogramming, and bespoke color palettes.
              </p>

              <div className="pt-2 space-y-2 text-xs text-[#1A1F2C] font-semibold">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Minimum bulk order starts at only 25 pieces</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Wholesale tiered discounts up to 35% OFF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doorstep delivery across all Indian cities</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendInquiry} className="lg:col-span-7 bg-[#EEF3FA]/40 p-6 sm:p-8 rounded-3xl border border-[#B9C9E7]/60 space-y-4">
              <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
                Send Direct Bulk Inquiry to WhatsApp
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Ananya Mehta"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    Occasion / Event
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    <option>Wedding Favors & Return Gifts</option>
                    <option>Corporate Branding & Employee Hampers</option>
                    <option>Retail Store Wholesale</option>
                    <option>Personalized Birthday / Anniversary Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                    Estimated Quantity
                  </label>
                  <select
                    value={inquiryQuantity}
                    onChange={(e) => setInquiryQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none"
                  >
                    <option>25 - 50 Totes</option>
                    <option>50 - 100 Totes</option>
                    <option>100 - 250 Totes</option>
                    <option>250+ Totes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                  Specific Requirements or Date of Event
                </label>
                <textarea
                  rows={2}
                  value={inquiryNote}
                  onChange={(e) => setInquiryNote(e.target.value)}
                  placeholder="e.g. Wedding in Punjab on Nov 20th, looking for custom prints with initials."
                  className="w-full p-3 text-xs rounded-xl bg-white border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit Inquiry via WhatsApp</span>
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
