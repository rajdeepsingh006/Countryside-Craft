const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getAllApprovedReviews,
  getProductReviews,
  submitReview,
} = require('../controllers/review.controller');
const { validate } = require('../middlewares/validateRequest.middleware');
const { submitReviewSchema } = require('../validators/review.validator');

// Rate limit: 3 reviews per hour per IP to prevent review bot spam
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'Too many reviews submitted from this connection. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/reviews — Public approved reviews for homepage
router.get('/reviews', getAllApprovedReviews);

// POST /api/reviews — Direct review submission
router.post('/reviews', reviewLimiter, validate(submitReviewSchema), submitReview);

// GET & POST /api/products/:id/reviews
router.get('/products/:id/reviews', getProductReviews);
router.post('/products/:id/reviews', reviewLimiter, validate(submitReviewSchema), submitReview);

module.exports = router;
