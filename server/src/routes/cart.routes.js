const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cart.controller');
const sessionMiddleware = require('../middlewares/session.middleware');

// All cart routes require a session
router.use(sessionMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.patch('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
