import api from './api';

export const authService = {
  async login(username, password) {
    const { data } = await api.post('/admin/auth/login', { username, password });
    return data.data; // { admin, accessToken }
  },

  async logout() {
    await api.post('/admin/auth/logout');
    localStorage.removeItem('cc_admin_access_token');
    localStorage.removeItem('cc_admin_auth_user');
  },

  async refresh() {
    const { data } = await api.post('/admin/auth/refresh');
    return data.data;
  },
};
