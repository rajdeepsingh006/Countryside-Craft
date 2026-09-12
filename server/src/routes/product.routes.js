const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug } = require('../controllers/product.controller');

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

module.exports = router;
