import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const { data } = await api.post('/orders', orderData);
    return data.data; // { order, whatsappUrl }
  },

  async getOrderById(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.data;
  },
};
