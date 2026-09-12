import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface TestimonialsSectionProps {
  onNavigate: (view: string, param?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onNavigate }) => {
  const { reviews, openReviewModal } = useStore();

  const approvedReviews = reviews.filter((r) => r.isApproved);

  return (
    <section className="py-16 bg-[#FAF7F2] border-t border-[#E8DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8DFD0] gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-[#8C5E3C] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
              Loved by Conscious Shoppers & Gifting Curators
            </h2>
          </div>

          <button
            id="write-a-review-home-btn"
            onClick={() => openReviewModal()}
            className="px-4 py-2.5 rounded-xl bg-[#EDE4D5] hover:bg-[#E0D4C0] text-[#4A4032] text-xs font-bold transition-colors flex items-center space-x-2 shrink-0 border border-[#D5C7B3]"
          >
            <MessageSquare className="w-4 h-4 text-[#8C5E3C]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {approvedReviews.slice(0, 3).map((review) => (
            <div
              key={review._id}
              className="p-6 rounded-2xl bg-white border border-[#E5DAC8] shadow-sm flex flex-col justify-between space-y-4 relative"
            >
              <Quote className="w-8 h-8 text-[#EADECC] absolute top-4 right-4" />

              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#2A231C] ml-1.5">{review.rating}.0</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#4E4437] leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-3 border-t border-[#F2ECE1]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#2A231C] flex items-center space-x-1">
                      <span>{review.customerName}</span>
                      {review.isVerifiedPurchase && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" title="Verified Customer" />
                      )}
                    </h4>
                    <p className="text-[11px] text-[#8C7E6C]">{review.customerLocation || 'India'}</p>
                  </div>
                </div>

                {review.productName && (
                  <span className="mt-2 block text-[10px] text-[#8C5E3C] font-semibold truncate bg-[#FAF6EE] px-2 py-1 rounded-md">
                    Purchased: {review.productName}
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
