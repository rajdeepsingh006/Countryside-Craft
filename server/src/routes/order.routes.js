const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order.controller');
const { validate } = require('../middlewares/validateRequest.middleware');
const { createOrderSchema } = require('../validators/order.validator');
const sessionMiddleware = require('../middlewares/session.middleware');
const rateLimit = require('express-rate-limit');

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, message: 'Too many orders submitted. Please try again later.' },
});

// POST /api/orders
router.post('/', orderLimiter, sessionMiddleware, validate(createOrderSchema), createOrder);

module.exports = router;
