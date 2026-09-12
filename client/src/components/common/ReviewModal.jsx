import React, { useState } from 'react';
import { X, Star, Sparkles, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { reviewService } from '../../services/reviewService';

export const ReviewModal = () => {
  const { isReviewModalOpen, closeReviewModal, reviewModalProduct, products, showToast } = useStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isReviewModalOpen) return null;
  const currentProduct = reviewModalProduct || products[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim() || !currentProduct) return;
    setSubmitting(true);
    try {
      await reviewService.submitReview({
        productId: currentProduct._id,
        customerName: customerName.trim(),
        customerLocation: customerLocation.trim() || 'India',
        rating,
        comment: comment.trim(),
      });
      showToast('Thank you! Your review has been submitted and is pending approval.', 'success');
      closeReviewModal();
      setCustomerName('');
      setCustomerLocation('');
      setComment('');
    } catch {
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={closeReviewModal} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-[#B9C9E7]/60 max-w-lg w-full overflow-hidden z-10">
        <div className="px-6 py-4 bg-[#EEF3FA] border-b border-[#B9C9E7]/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D91680]" />
            <h3 className="text-base font-serif-display font-bold text-[#1A1F2C]">
              Share Your Artisan Experience
            </h3>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-1 rounded-full text-[#6A758E] hover:bg-[#DEE8F7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {currentProduct && (
            <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#FCFBFA] border border-[#B9C9E7]/50">
              <img
                src={currentProduct.images?.[0]}
                alt={currentProduct.name}
                className="w-12 h-12 object-cover rounded-xl border border-[#B9C9E7]/60"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#D91680] block">
                  Reviewing Product
                </span>
                <h4 className="text-xs font-bold text-[#1A1F2C] truncate">
                  {currentProduct.name}
                </h4>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1A1F2C] mb-1.5">
              Your Overall Rating *
            </label>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-[#D2DBE8]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#D91680] ml-2">
                {rating === 5
                  ? '5 - Loved the Craftsmanship!'
                  : rating === 4
                  ? '4 - Very Good Quality'
                  : rating === 3
                  ? '3 - Average'
                  : '2 - Needs Improvement'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Radhika Verma"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="e.g. Bangalore, KA"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1F2C] mb-1">
              Your Review & Thoughts on Quality *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the canvas thickness, strap comfort, print vibrance, and how you use your tote bag..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680] resize-none"
            />
          </div>

          <p className="text-[11px] text-[#6A758E] italic leading-snug">
            🛡️ Customer reviews are checked by our team before publishing.
          </p>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeReviewModal}
              className="px-4 py-2.5 rounded-xl border border-[#B9C9E7] text-xs font-bold text-[#4B566E] hover:bg-[#EEF3FA] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors flex items-center space-x-1.5 disabled:opacity-60 cursor-pointer border border-[#EFC0DA]"
            >
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
