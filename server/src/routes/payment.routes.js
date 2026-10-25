const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} = require('../controllers/payment.controller');

// Endpoints:
// POST /api/create-order & /api/payments/create-order
router.post('/create-order', createRazorpayOrder);

// POST /api/verify-payment & /api/payments/verify
router.post('/verify-payment', verifyRazorpayPayment);
router.post('/verify', verifyRazorpayPayment);

// POST /api/payments/webhook
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;
