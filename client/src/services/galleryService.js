import api from './api';

export const galleryService = {
  async getGallery(category = '') {
    const params = category ? { category } : {};
    const { data } = await api.get('/gallery', { params });
    return data.data || [];
  },
};
