const Session = require('../models/session.model');
const Product = require('../models/product.model');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// GET /api/cart — Get current session cart with populated product data
const getCart = async (req, res) => {
  const session = await Session.findById(req.session._id).populate({
    path: 'cartItems.product',
    select: 'name price discountPercent images stock isActive slug',
  });

  // Filter out items where the product no longer exists or is inactive
  const validItems = session.cartItems.filter(
    (item) => item.product && item.product.isActive
  );

  return sendSuccess(res, { cartItems: validItems });
};

// POST /api/cart/add — Add item to cart (or increment quantity if it exists)
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return sendError(res, 'productId is required.', 422);

  const product = await Product.findById(productId);
  if (!product || !product.isActive) return sendError(res, 'Product not found.', 404);
  if (product.stock < 1) return sendError(res, 'This product is out of stock.', 400);

  const session = req.session;
  const existingItem = session.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + Number(quantity);
    if (newQty > product.stock) {
      return sendError(res, `Only ${product.stock} units available.`, 400);
    }
    existingItem.quantity = newQty;
  } else {
    if (Number(quantity) > product.stock) {
      return sendError(res, `Only ${product.stock} units available.`, 400);
    }
    session.cartItems.push({ product: productId, quantity: Number(quantity) });
  }

  await session.save();
  return sendSuccess(res, { cartItems: session.cartItems }, 'Item added to cart');
};

// PUT /api/cart/update — Update item quantity
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity === undefined) {
    return sendError(res, 'productId and quantity are required.', 422);
  }

  const session = req.session;
  const item = session.cartItems.find(
    (item) => item.product.toString() === productId
  );
  if (!item) return sendError(res, 'Item not found in cart.', 404);

  if (Number(quantity) <= 0) {
    // Remove item if quantity is 0 or less
    session.cartItems = session.cartItems.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    const product = await Product.findById(productId);
    if (Number(quantity) > product.stock) {
      return sendError(res, `Only ${product.stock} units available.`, 400);
    }
    item.quantity = Number(quantity);
  }

  await session.save();
  return sendSuccess(res, { cartItems: session.cartItems }, 'Cart updated');
};

// DELETE /api/cart/remove/:productId — Remove item from cart
const removeFromCart = async (req, res) => {
  const session = req.session;
  const before = session.cartItems.length;
  session.cartItems = session.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  if (session.cartItems.length === before) {
    return sendError(res, 'Item not found in cart.', 404);
  }

  await session.save();
  return sendSuccess(res, { cartItems: session.cartItems }, 'Item removed from cart');
};

// DELETE /api/cart/clear — Clear entire cart (used after order placed)
const clearCart = async (req, res) => {
  req.session.cartItems = [];
  await req.session.save();
  return sendSuccess(res, null, 'Cart cleared');
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
