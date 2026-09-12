const express = require('express');
const router = express.Router();
const {
  getAllApprovedReviews,
  getProductReviews,
  submitReview,
} = require('../controllers/review.controller');

// GET /api/reviews — Public approved reviews for homepage
router.get('/reviews', getAllApprovedReviews);

// POST /api/reviews — Direct review submission
router.post('/reviews', submitReview);

// GET & POST /api/products/:id/reviews
router.get('/products/:id/reviews', getProductReviews);
router.post('/products/:id/reviews', submitReview);

module.exports = router;
