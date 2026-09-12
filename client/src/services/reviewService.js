import api from './api';

export const reviewService = {
  async getReviews(productId) {
    const { data } = await api.get(`/products/${productId}/reviews`);
    return data.data || [];
  },

  async submitReview(reviewData) {
    const { data } = await api.post(`/products/${reviewData.productId}/reviews`, reviewData);
    return data.data;
  },
};
