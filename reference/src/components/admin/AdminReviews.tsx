import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Check, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview, showToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  const handleApprove = (id: string) => {
    approveReview(id, true);
    showToast('Review approved and published to storefront!', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review?')) {
      deleteReview(id);
      showToast('Review removed.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8DFD0] shadow-xs">
        <div>
          <h3 className="font-serif-display font-bold text-base text-[#241F18]">
            Customer Reviews & Ratings ({reviews.length})
          </h3>
          <p className="text-xs text-[#7A6D5C]">
            Moderate incoming testimonials before they appear live on product pages.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'all' ? 'bg-[#3B362F] text-white' : 'bg-[#FAF7F2] text-[#544A3C] border border-[#D5C7B2]'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'pending' ? 'bg-[#8C5E3C] text-white' : 'bg-[#FAF7F2] text-[#544A3C] border border-[#D5C7B2]'
            }`}
          >
            Pending ({reviews.filter((r) => !r.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'approved' ? 'bg-[#3B362F] text-white' : 'bg-[#FAF7F2] text-[#544A3C] border border-[#D5C7B2]'
            }`}
          >
            Approved ({reviews.filter((r) => r.isApproved).length})
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-2 py-12 bg-white rounded-2xl border border-[#E8DFD0] text-center text-xs text-[#8C7E6C]">
            No reviews matching this filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-2xl bg-white border border-[#E8DFD0] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-[#241F18]">{rev.customerName}</span>
                    {rev.customerLocation && (
                      <span className="text-[11px] text-[#8C7E6C]">({rev.customerLocation})</span>
                    )}
                    {rev.isVerifiedPurchase && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#4A4032] italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.productName && (
                  <span className="inline-block text-[10px] text-[#8C5E3C] font-semibold bg-[#FAF6EE] px-2 py-1 rounded">
                    Product: {rev.productName}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                <span className="text-[10px] text-[#A39684]">{formatDate(rev.createdAt)}</span>

                <div className="flex items-center space-x-2">
                  {!rev.isApproved ? (
                    <button
                      onClick={() => handleApprove(rev._id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Published
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
