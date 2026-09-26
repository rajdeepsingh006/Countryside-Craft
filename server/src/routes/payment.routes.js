const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/payment.controller');

// Standard endpoints as specified in task:
// POST /api/create-order
router.post('/create-order', createRazorpayOrder);

// POST /api/verify-payment
router.post('/verify-payment', verifyRazorpayPayment);

module.exports = router;
