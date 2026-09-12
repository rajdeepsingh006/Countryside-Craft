import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { storageService } from '../services/storageService';

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  totalSavings: number;
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, customNote?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync to storage on change
  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const totalSavings = cart.reduce((sum, item) => {
    if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, customNote?: string) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product._id === product._id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          selectedColor: selectedColor || updated[existingIdx].selectedColor,
          customGiftNote: customNote || updated[existingIdx].customGiftNote
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor, customGiftNote: customNote }];
      }
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock || 99) } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    storageService.clearCart();
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        totalSavings,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
