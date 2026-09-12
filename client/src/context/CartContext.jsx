import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

const defaultCartContext = {
  cart: [],
  totalItems: 0,
  subtotal: 0,
  totalSavings: 0,
  isCartOpen: false,
  loading: false,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  refreshCart: async () => {},
};

export const CartContext = createContext(defaultCartContext);

// Normalizes a cart response from the backend into a uniform shape
// Server returns either { cartItems: [...] } (with product subdoc) or { items: [...] }
const normalizeCart = (serverCart) => {
  if (!serverCart) return { items: [], totalItems: 0, subtotal: 0 };

  // Server cart.controller returns { cartItems: [{product: populatedObj, quantity}] }
  const rawItems = serverCart.cartItems || serverCart.items || [];
  const items = rawItems.map((item) => {
    // item.product is a populated Product document from server
    const prod = item.product || {};
    const effectivePrice = prod.discountPercent > 0
      ? parseFloat((prod.price - (prod.price * prod.discountPercent) / 100).toFixed(2))
      : (prod.price ?? 0);
    return {
      product: {
        _id: prod._id || item.productId,
        name: prod.name || '',
        slug: prod.slug || '',
        images: prod.images || [],
        price: effectivePrice,
        originalPrice: prod.price,
        discountPercent: prod.discountPercent || 0,
        stock: prod.stock || 99,
        ratingAverage: prod.ratingAverage || 0,
        ratingCount: prod.ratingCount || 0,
        isFeatured: prod.isFeatured || false,
        tags: prod.tags || [],
        category: prod.category || '',
      },
      quantity: item.quantity,
      selectedColor: item.selectedColor || '',
      customGiftNote: item.customNote || '',
    };
  });
  return {
    items,
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  };
};

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({ items: [], totalItems: 0, subtotal: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const serverCart = await cartService.getCart();
      setCartData(normalizeCart(serverCart));
    } catch {
      setCartData({ items: [], totalItems: 0, subtotal: 0 });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1, selectedColor = '', customNote = '') => {
    setLoading(true);
    try {
      await cartService.addToCart(product._id, quantity, selectedColor, customNote);
      await fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    try {
      await cartService.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Update qty failed:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartData({ items: [], totalItems: 0, subtotal: 0 });
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  };

  const totalSavings = cartData.items.reduce((sum, item) => {
    if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: cartData.items,
        totalItems: cartData.totalItems,
        subtotal: cartData.subtotal,
        totalSavings,
        isCartOpen,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((p) => !p),
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  return ctx || defaultCartContext;
};
