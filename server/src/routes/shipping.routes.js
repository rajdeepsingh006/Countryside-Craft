const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');

// POST /api/shipping/calculate
router.post('/calculate', shippingController.calculate);

// GET /api/shipping/rates
router.get('/rates', shippingController.getRates);

module.exports = router;
