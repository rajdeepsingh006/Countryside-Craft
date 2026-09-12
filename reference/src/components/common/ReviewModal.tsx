import React, { useState } from 'react';
import { X, Star, Sparkles, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, closeReviewModal, reviewModalProduct, submitReview, products } = useStore();
  const [selectedProductId, setSelectedProductId] = useState<string>(reviewModalProduct?._id || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [comment, setComment] = useState('');

  if (!isReviewModalOpen) return null;

  const currentProduct = reviewModalProduct || products.find((p) => p._id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim() || !currentProduct) return;

    submitReview({
      productId: currentProduct._id,
      productName: currentProduct.name,
      customerName: customerName.trim(),
      customerLocation: customerLocation.trim() || 'India',
      rating,
      comment: comment.trim(),
      isVerifiedPurchase: true
    });

    closeReviewModal();
    setCustomerName('');
    setCustomerLocation('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeReviewModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DED2C0] max-w-lg w-full overflow-hidden z-10 animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F4EFE6] border-b border-[#E4D9C7] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#8C5E3C]" />
            <h3 className="text-base font-serif-display font-bold text-[#2A241E]">
              Share Your Artisan Experience
            </h3>
          </div>
          <button
            onClick={closeReviewModal}
            className="p-1 rounded-full text-[#706454] hover:bg-[#EAE0D0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target Product Tag */}
          {currentProduct && (
            <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white border border-[#E3D8C6]">
              <img
                src={currentProduct.images[0]}
                alt={currentProduct.name}
                className="w-12 h-12 object-cover rounded-lg border border-[#D5C7B3]"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-[#8C5E3C] block">
                  Reviewing Product
                </span>
                <h4 className="text-xs font-semibold text-[#28231C] truncate">
                  {currentProduct.name}
                </h4>
              </div>
            </div>
          )}

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-[#423A2F] mb-1.5">
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
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-[#D0C2AE]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-[#736553] ml-2">
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

          {/* Customer Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#423A2F] mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Radhika Verma"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D0C2AE] text-[#28231C] focus:outline-none focus:border-[#8C5E3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#423A2F] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="e.g. Bangalore, KA"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D0C2AE] text-[#28231C] focus:outline-none focus:border-[#8C5E3C]"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-[#423A2F] mb-1">
              Your Review & Thoughts on Quality *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the canvas thickness, strap comfort, print vibrance, and how you use your tote bag..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#D0C2AE] text-[#28231C] focus:outline-none focus:border-[#8C5E3C] resize-none"
            />
          </div>

          <p className="text-[11px] text-[#7A6C5B] italic leading-snug">
            🛡️ To prevent spam, customer reviews are checked by our team before publishing to the live product page.
          </p>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeReviewModal}
              className="px-4 py-2.5 rounded-xl border border-[#D0C2AE] text-xs font-semibold text-[#665949] hover:bg-[#EAE0D0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8C5E3C] hover:bg-[#A36E46] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors flex items-center space-x-1.5"
            >
              <span>Submit Review</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
