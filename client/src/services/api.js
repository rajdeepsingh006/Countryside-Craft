import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Ensure a persistent visitor session token exists
const getVisitorSessionToken = () => {
  let token = localStorage.getItem('cc_visitor_session_token');
  if (!token) {
    token = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('cc_visitor_session_token', token);
  }
  return token;
};

// Attach access token and visitor session token to every request
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('cc_admin_access_token');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  const sessionToken = getVisitorSessionToken();
  config.headers['x-session-token'] = sessionToken;

  return config;
});

// On response, save server-generated session token if provided
api.interceptors.response.use(
  (res) => {
    const serverSessionToken = res.headers['x-session-token'];
    if (serverSessionToken) {
      localStorage.setItem('cc_visitor_session_token', serverSessionToken);
    }
    return res;
  },
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && original.url?.includes('/admin/')) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/admin/auth/refresh', {}, { withCredentials: true });
        localStorage.setItem('cc_admin_access_token', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('cc_admin_access_token');
        localStorage.removeItem('cc_admin_auth_user');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
