import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return data.data; // { products, total, page, pages }
  },

  async getProductBySlug(slug) {
    const { data } = await api.get(`/products/${slug}`);
    return data.data;
  },

  async getCategories() {
    const { data } = await api.get('/categories');
    return data.data;
  },

  async getFeaturedProducts() {
    const { data } = await api.get('/products', { params: { featured: true, limit: 6 } });
    return data.data.products || [];
  },
};
