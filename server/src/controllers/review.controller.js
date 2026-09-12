const mongoose = require('mongoose');
const Review = require('../models/review.model');
const Product = require('../models/product.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/reviews — Public approved reviews for homepage & testimonials
const getAllApprovedReviews = async (req, res) => {
  const { limit = 20 } = req.query;
  const reviews = await Review.find({ isApproved: true })
    .populate('product', 'name slug images price')
    .sort({ createdAt: -1 })
    .limit(Number(limit));
  return sendSuccess(res, { reviews });
};

// GET /api/products/:id/reviews — List approved reviews for a single product
const getProductReviews = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const productId = req.params.id;

  let filterId = productId;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const found = await Product.findOne({ slug: productId }).select('_id');
    if (found) {
      filterId = found._id;
    } else {
      return sendSuccess(res, { reviews: [], total: 0, page: Number(page), totalPages: 0 });
    }
  }

  const reviews = await Review.find({ product: filterId, isApproved: true })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Review.countDocuments({ product: filterId, isApproved: true });
  return sendSuccess(res, { reviews, total, page: Number(page), totalPages: Math.ceil(total / limit) });
};

// POST /api/products/:id/reviews or POST /api/reviews — Customer submits new review
const submitReview = async (req, res) => {
  const productId = req.params.id || req.body.productId || req.body.product;
  const { customerName, customerLocation, rating, comment, images } = req.body;

  if (!productId) {
    return sendError(res, 'Product ID is required.', 422);
  }
  if (!customerName || !rating || !comment) {
    return sendError(res, 'Customer name, star rating, and review comment are required.', 422);
  }
  if (rating < 1 || rating > 5) {
    return sendError(res, 'Rating must be between 1 and 5 stars.', 422);
  }

  let product = null;
  if (mongoose.Types.ObjectId.isValid(productId)) {
    product = await Product.findById(productId);
  } else {
    product = await Product.findOne({ slug: productId });
  }
  if (!product) return sendError(res, 'Product not found.', 404);

  const review = await Review.create({
    product: productId,
    customerName: customerName.trim(),
    customerLocation: customerLocation ? customerLocation.trim() : 'India',
    rating: Number(rating),
    comment: comment.trim(),
    images: Array.isArray(images) ? images : [],
    isVerifiedPurchase: true,
    isApproved: false, // Pending admin approval
  });

  return sendSuccess(
    res,
    { review },
    'Thank you! Your review has been submitted and will appear after moderation.',
    201
  );
};

// ─── ADMIN ──────────────────────────────────────────────────────

// POST /api/admin/reviews — Admin creates a custom verified review
const createAdminReview = async (req, res) => {
  const {
    productId,
    product: prodId,
    customerName,
    customerLocation,
    rating = 5,
    comment,
    isApproved = true,
    isVerifiedPurchase = true,
    images,
  } = req.body;

  const targetProductId = productId || prodId;
  if (!targetProductId) {
    return sendError(res, 'Please select a product for the review.', 422);
  }
  if (!customerName || !comment) {
    return sendError(res, 'Customer name and review comment are required.', 422);
  }

  const product = await Product.findById(targetProductId);
  if (!product) return sendError(res, 'Selected product does not exist.', 404);

  const review = await Review.create({
    product: targetProductId,
    customerName: customerName.trim(),
    customerLocation: customerLocation ? customerLocation.trim() : 'Verified Buyer',
    rating: Number(rating),
    comment: comment.trim(),
    images: Array.isArray(images) ? images : [],
    isVerifiedPurchase: isVerifiedPurchase !== false,
    isApproved: isApproved !== false,
  });

  await review.populate('product', 'name slug');
  return sendSuccess(res, { review }, 'Custom review added and published successfully!', 201);
};

// GET /api/admin/reviews — List all reviews (pending & approved)
const adminGetReviews = async (req, res) => {
  const { page = 1, limit = 50, isApproved } = req.query;
  const filter = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

  const reviews = await Review.find(filter)
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Review.countDocuments(filter);
  return sendSuccess(res, { reviews, total });
};

// PUT /api/admin/reviews/:id/approve — Approve or reject review
const approveReview = async (req, res) => {
  const { isApproved } = req.body;
  if (typeof isApproved !== 'boolean') {
    return sendError(res, 'isApproved must be a boolean.', 422);
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved },
    { new: true }
  ).populate('product', 'name slug');

  if (!review) return sendError(res, 'Review not found.', 404);

  return sendSuccess(
    res,
    { review },
    isApproved ? 'Review approved and published to storefront.' : 'Review marked as pending/rejected.'
  );
};

// DELETE /api/admin/reviews/:id — Permanently remove a review
const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return sendError(res, 'Review not found.', 404);
  return sendSuccess(res, null, 'Review deleted successfully.');
};

module.exports = {
  getAllApprovedReviews,
  getProductReviews,
  submitReview,
  createAdminReview,
  adminGetReviews,
  approveReview,
  deleteReview,
};
