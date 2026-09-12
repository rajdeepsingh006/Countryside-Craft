import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const defaultAuthContext = {
  admin: null,
  token: null,
  isAuthenticated: false,
  isMainAdmin: false,
  login: async () => ({ success: false }),
  logout: async () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_admin_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cc_admin_access_token') || null);

  useEffect(() => {
    if (admin) localStorage.setItem('cc_admin_auth_user', JSON.stringify(admin));
    else localStorage.removeItem('cc_admin_auth_user');
  }, [admin]);

  useEffect(() => {
    if (token) localStorage.setItem('cc_admin_access_token', token);
    else localStorage.removeItem('cc_admin_access_token');
  }, [token]);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      setAdmin(result.admin);
      setToken(result.accessToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    setAdmin(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(admin && token);
  const isMainAdmin = admin?.role === 'main_admin';

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated, isMainAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx || defaultAuthContext;
};
