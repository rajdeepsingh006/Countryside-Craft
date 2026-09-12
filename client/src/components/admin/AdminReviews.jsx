import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Check,
  Sparkles,
  Plus,
  X,
  RefreshCw,
  MessageSquare,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';

export const AdminReviews = () => {
  const { products, showToast, refreshData } = useStore();
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom review form state
  const [formData, setFormData] = useState({
    productId: '',
    customerName: '',
    customerLocation: 'Mumbai, Maharashtra',
    rating: 5,
    comment: '',
    isVerifiedPurchase: true,
    isApproved: true,
  });

  const fetchAdminReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews();
      const revs = res.reviews || (Array.isArray(res) ? res : []);
      setReviewsList(revs);
    } catch (err) {
      console.error('Failed to load admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  const filteredReviews = reviewsList.filter((r) => {
    if (filter === 'pending') return r.isApproved === false;
    if (filter === 'approved') return r.isApproved !== false;
    return true;
  });

  const handleOpenAdd = () => {
    const defaultProdId = products[0]?._id || '';
    setFormData({
      productId: defaultProdId,
      customerName: '',
      customerLocation: 'Bengaluru, Karnataka',
      rating: 5,
      comment: '',
      isVerifiedPurchase: true,
      isApproved: true,
    });
    setIsModalOpen(true);
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.comment.trim()) {
      showToast('Customer name and review comment are required.', 'warning');
      return;
    }
    if (!formData.productId) {
      showToast('Please select a product for the review.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const created = await adminService.createReview({
        ...formData,
        customerName: formData.customerName.trim(),
        customerLocation: formData.customerLocation.trim() || 'Verified Buyer',
        comment: formData.comment.trim(),
      });
      const newReview = created.review || created;
      setReviewsList((prev) => [newReview, ...prev]);
      await refreshData();
      showToast('Custom review published to storefront!', 'success');
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveReview(id, true);
      setReviewsList((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: true } : r))
      );
      await refreshData();
      showToast('Review approved and published to storefront!', 'success');
    } catch {
      showToast('Failed to approve review', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer review?')) {
      try {
        await adminService.deleteReview(id);
        setReviewsList((prev) => prev.filter((r) => r._id !== id));
        await refreshData();
        showToast('Review removed.', 'info');
      } catch {
        showToast('Failed to delete review', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#B9C9E7]/50 shadow-xs">
        <div>
          <h3 className="font-serif-display font-bold text-base text-[#1A1F2C]">
            Customer Reviews & Ratings ({reviewsList.length})
          </h3>
          <p className="text-xs text-[#6A758E]">
            Publish artisan testimonials and moderate customer ratings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex space-x-1 bg-[#EEF3FA]/70 p-1 rounded-2xl border border-[#B9C9E7]/60">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#1A1F2C] text-white shadow-xs'
                  : 'text-[#3E475C] hover:bg-[#EEF3FA]'
              }`}
            >
              All ({reviewsList.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'pending'
                  ? 'bg-[#D91680] text-white shadow-xs'
                  : 'text-[#3E475C] hover:bg-[#EEF3FA]'
              }`}
            >
              Pending ({reviewsList.filter((r) => r.isApproved === false).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filter === 'approved'
                  ? 'bg-[#1A1F2C] text-white shadow-xs'
                  : 'text-[#3E475C] hover:bg-[#EEF3FA]'
              }`}
            >
              Approved ({reviewsList.filter((r) => r.isApproved !== false).length})
            </button>
          </div>

          <button
            onClick={fetchAdminReviews}
            title="Refresh Reviews"
            className="p-2 rounded-xl bg-[#EEF3FA] hover:bg-[#DEE8F7] text-[#D91680] border border-[#B9C9E7] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#D91680] hover:bg-[#BE0E6E] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md active:scale-98 cursor-pointer border border-[#EFC0DA]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-xs text-[#6A758E]">
            <div className="w-5 h-5 border-2 border-[#D91680] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading customer reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-2 py-12 bg-white rounded-3xl border border-[#B9C9E7]/50 text-center text-xs text-[#6A758E]">
            No reviews matching this filter. Click "Add Custom Review" to add testimonials.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-3xl bg-white border border-[#B9C9E7]/50 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-[#1A1F2C]">{rev.customerName}</span>
                    {rev.customerLocation && (
                      <span className="text-[11px] text-[#6A758E]">({rev.customerLocation})</span>
                    )}
                    {rev.isVerifiedPurchase !== false && (
                      <span className="text-[9px] font-black bg-[#DBE586] text-[#343C05] px-2 py-0.5 rounded-full">
                        ✓ Verified Buyer
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

                <p className="text-xs text-[#3E475C] italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.product?.name && (
                  <span className="inline-flex items-center space-x-1 text-[10px] text-[#D91680] font-bold bg-[#FDF1F7] px-2.5 py-1 rounded-full border border-[#EFC0DA]">
                    <ShoppingBag className="w-3 h-3 text-[#D91680]" />
                    <span>Product: {rev.product.name}</span>
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-[#EEF3FA] flex items-center justify-between">
                <span className="text-[10px] text-[#8E9DBE]">{formatDate(rev.createdAt)}</span>

                <div className="flex items-center space-x-2">
                  {rev.isApproved === false ? (
                    <button
                      onClick={() => handleApprove(rev._id)}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ Published
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Add Custom Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full border border-[#B9C9E7]/60 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EEF3FA]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#D91680]" />
                <h3 className="font-serif-display font-bold text-lg text-[#1A1F2C]">
                  Add Custom Review / Testimonial
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-[#6A758E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
              
              {/* Product Selector */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Select Product *</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] font-semibold focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Star Rating (1 to 5)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          formData.rating >= star
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-[#D2DBE8]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#D91680] ml-2">
                    {formData.rating} Stars
                  </span>
                </div>
              </div>

              {/* Customer Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">Customer / Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A1F2C] mb-1">City / Region</label>
                  <input
                    type="text"
                    value={formData.customerLocation}
                    onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                    placeholder="e.g. Mumbai, MH"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none focus:border-[#D91680]"
                  />
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block font-bold text-[#1A1F2C] mb-1">Review Feedback & Thoughts *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="e.g. The Bagru indigo block print is so rich and earthy! Sturdy 450 GSM canvas and roomy interior with brass zipper..."
                  className="w-full p-3 rounded-xl bg-[#EEF3FA]/40 border border-[#B9C9E7] text-[#1A1F2C] focus:outline-none resize-none"
                />
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isApproved}
                    onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                    className="rounded text-[#D91680] accent-[#D91680]"
                  />
                  <span className="font-bold text-[#1A1F2C]">Publish to Storefront Immediately</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerifiedPurchase}
                    onChange={(e) => setFormData({ ...formData, isVerifiedPurchase: e.target.checked })}
                    className="rounded text-[#D91680] accent-[#D91680]"
                  />
                  <span className="font-bold text-[#1A1F2C]">Show "Verified Buyer" Badge</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#EEF3FA]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl bg-[#D91680] hover:bg-[#BE0E6E] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors disabled:opacity-50 cursor-pointer border border-[#EFC0DA]"
                >
                  {submitting ? 'Saving Review...' : 'Publish Custom Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl bg-neutral-100 text-neutral-800 font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
