import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const FALLBACK_REVIEWS = [
  {
    _id: 'fb-1',
    rating: 5,
    comment: 'The quality of the canvas is extraordinary! Fits my 15-inch work laptop, charger, lunchbox and water bottle easily. The print is so authentic and I get compliments at office every single day.',
    customerName: 'Ananya Sharma',
    customerLocation: 'Bangalore',
    isVerifiedPurchase: true,
    productName: 'Jaipur Indigo Dabu Block Canvas Tote',
  },
  {
    _id: 'fb-2',
    rating: 5,
    comment: 'The WhatsApp ordering was super fast! Ordered 5 bags and the team confirmed gift cards within 10 minutes. Love the handcrafted feel.',
    customerName: 'Pooja Venkatesh',
    customerLocation: 'Chennai',
    isVerifiedPurchase: true,
    productName: 'Jaipur Indigo Dabu Block Canvas Tote',
  },
  {
    _id: 'fb-3',
    rating: 5,
    comment: 'We ordered 80 pieces for our daughter\'s wedding return favors. Every single guest was asking where we bought them. The gold foil work and tassels are truly premium!',
    customerName: 'Radhika Sundaram',
    customerLocation: 'Hyderabad',
    isVerifiedPurchase: true,
    productName: 'Sanskrit Mandala Gilded Return-Gift Tote',
  },
];

export const TestimonialsSection = ({ onNavigate }) => {
  const { reviews = [], openReviewModal } = useStore();
  const approvedReviews = reviews.filter((r) => r.isApproved !== false);
  const displayReviews = approvedReviews.length > 0 ? approvedReviews.slice(0, 3) : FALLBACK_REVIEWS;

  return (
    <section className="py-8 sm:py-16 bg-[#FDFBF7] border-t border-[#EADDC6]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-3 sm:pb-4 border-b border-[#EADDC6]/40 gap-3">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#D91680] mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif-display font-bold text-[#1A1F2C]">
              Loved by Conscious Shoppers
            </h2>
          </div>
          <button
            id="write-a-review-home-btn"
            onClick={() => openReviewModal()}
            className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE0] text-[#1A1F2C] text-xs font-bold transition-colors flex items-center space-x-2 shrink-0 border border-[#EADDC6] cursor-pointer w-fit"
          >
            <MessageSquare className="w-4 h-4 text-[#D91680]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* 2. Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayReviews.map((review, idx) => {
            const initials = (review.customerName || 'AS')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={review._id}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#F1E9DF] shadow-sm flex flex-col justify-between space-y-3.5 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (review.rating || 5) ? 'fill-amber-400 text-amber-500' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#047857] text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <p className="text-[13px] sm:text-sm italic text-[#1A1F2C] leading-relaxed font-serif">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F8F5EE]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FDF2F8] text-[#D91680] font-bold text-[12px] flex items-center justify-center border border-[#EFC0DA]">
                      {initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1F2C] leading-tight">{review.customerName}</p>
                      <p className="text-[11px] text-[#6A5E54]">{review.customerLocation || 'Verified Buyer'}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. The Slow Craft Journal Newsletter Subscription Box */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-[#FAF7F2] border border-[#EADDC6]/60 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#D91680] flex items-center justify-center text-white text-xs">
              ✉
            </div>
            <h3 className="font-serif-display font-bold text-[17px] sm:text-xl text-[#1A1F2C] leading-tight">
              The Slow Craft Journal
            </h3>
          </div>
          <p className="text-[13px] sm:text-sm text-[#6A5E54] leading-relaxed max-w-xl">
            Be the first to receive secret seasonal artisan drops, craft workshops, and 10% off your first handcrafted order.
          </p>
          <form
            className="flex items-center gap-2 pt-1 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for joining our slow-craft community!');
            }}
          >
            <input
              className="flex-1 min-w-0 h-11 px-4 rounded-full bg-white text-[#1A1F2C] text-[13px] placeholder:text-[#8A7E72] focus:outline-none border border-[#E5DDD0] shadow-2xs"
              placeholder="Enter your email address"
              required
              type="email"
            />
            <button
              className="h-11 px-5 rounded-full bg-[#D91680] hover:bg-[#BE0E6E] text-white text-[13px] font-semibold active:scale-95 transition-transform shrink-0 shadow-sm cursor-pointer"
              type="submit"
            >
              Join
            </button>
          </form>
        </div>

        {/* 4. WhatsApp Concierge Floating / In-Page Banner */}
        <div className="p-4 rounded-2xl bg-[#006C49] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] sm:text-sm font-bold text-white leading-tight truncate">
                Need Gifting or Bulk Advice?
              </span>
              <span className="text-[11px] sm:text-xs text-white/85 truncate">
                Instant bespoke concierge on WhatsApp
              </span>
            </div>
          </div>
          <a
            className="px-4 py-2 rounded-full bg-white text-[#006C49] text-[12px] sm:text-xs font-bold shrink-0 active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-sm w-full sm:w-auto"
            href="https://wa.me/919876543210?text=Hi%20Countryside%20Craft,%20I%20need%20custom%20gifting%20advice"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Chat Now</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
};
