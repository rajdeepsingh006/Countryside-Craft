import api from './api';

export const cartService = {
  async getCart() {
    const { data } = await api.get('/cart');
    return data.data || { items: [], totalItems: 0, subtotal: 0 };
  },

  async addToCart(productId, quantity = 1, selectedColor = '', customNote = '') {
    const { data } = await api.post('/cart/add', { productId, quantity, selectedColor, customNote });
    return data.data;
  },

  async updateQuantity(productId, quantity) {
    const { data } = await api.patch('/cart/update', { productId, quantity });
    return data.data;
  },

  async removeFromCart(productId) {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    return data.data;
  },

  async clearCart() {
    const { data } = await api.delete('/cart/clear');
    return data.data;
  },
};
