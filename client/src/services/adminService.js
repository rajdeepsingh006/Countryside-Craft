import api from './api';

export const adminService = {
  // Dashboard
  async getStats() {
    const { data } = await api.get('/admin/dashboard/stats');
    return data.data;
  },

  // Products
  async getProducts(params = {}) {
    const { data } = await api.get('/admin/products', { params });
    return data.data;
  },
  async createProduct(productData) {
    const { data } = await api.post('/admin/products', productData);
    return data.data;
  },
  async updateProduct(id, productData) {
    const { data } = await api.put(`/admin/products/${id}`, productData);
    return data.data;
  },
  async saveProduct(productData) {
    if (productData._id) {
      const { data } = await api.put(`/admin/products/${productData._id}`, productData);
      return data.data;
    } else {
      const { data } = await api.post('/admin/products', productData);
      return data.data;
    }
  },
  async deleteProduct(id) {
    await api.delete(`/admin/products/${id}`);
  },

  // Orders
  async getOrders(params = {}) {
    const { data } = await api.get('/admin/orders', { params });
    return data.data;
  },
  async updateOrderStatus(id, status, adminNotes = '') {
    const { data } = await api.put(`/admin/orders/${id}/status`, { status, adminNotes });
    return data.data;
  },
  async exportOrders() {
    const res = await api.get('/admin/orders/export', { responseType: 'blob' });
    return res.data;
  },

  // Reviews
  async getReviews(params = {}) {
    const { data } = await api.get('/admin/reviews', { params });
    return data.data;
  },
  async createReview(reviewData) {
    const { data } = await api.post('/admin/reviews', reviewData);
    return data.data;
  },
  async approveReview(id, isApproved) {
    const { data } = await api.put(`/admin/reviews/${id}/approve`, { isApproved });
    return data.data;
  },
  async deleteReview(id) {
    await api.delete(`/admin/reviews/${id}`);
  },

  // Gallery
  async getGallery() {
    const { data } = await api.get('/admin/gallery');
    return data.data;
  },
  async uploadGalleryItem(payload) {
    if (payload instanceof FormData) {
      const { data } = await api.post('/admin/gallery', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } else {
      const { data } = await api.post('/admin/gallery', payload);
      return data.data;
    }
  },
  async updateGalleryItem(id, payload) {
    if (payload instanceof FormData) {
      const { data } = await api.put(`/admin/gallery/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } else {
      const { data } = await api.put(`/admin/gallery/${id}`, payload);
      return data.data;
    }
  },
  async deleteGalleryItem(id) {
    await api.delete(`/admin/gallery/${id}`);
  },

  // Admin users (FR-19)
  async getAdmins() {
    const { data } = await api.get('/admin/manage');
    return data.data;
  },
  async createAdmin(adminData) {
    const { data } = await api.post('/admin/manage', adminData);
    return data.data;
  },
  async updateAdmin(id, updates) {
    const { data } = await api.put(`/admin/manage/${id}`, updates);
    return data.data;
  },
  async deleteAdmin(id) {
    await api.delete(`/admin/manage/${id}`);
  },

  // Settings
  async getSettings() {
    const { data } = await api.get('/admin/settings');
    return data.data;
  },
  async updateSettings(settings) {
    const { data } = await api.put('/admin/settings', settings);
    return data.data;
  },

  // Generic File / Video Upload (Cloudinary)
  async uploadFiles(formData) {
    const { data } = await api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
