import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isMainAdmin: boolean;
  login: (username: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('vana_admin_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('vana_admin_jwt_token') || null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem('vana_admin_auth_user', JSON.stringify(admin));
    } else {
      localStorage.removeItem('vana_admin_auth_user');
    }
  }, [admin]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vana_admin_jwt_token', token);
    } else {
      localStorage.removeItem('vana_admin_jwt_token');
    }
  }, [token]);

  const login = (username: string, password = ''): { success: boolean; message?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const admins = storageService.getAdmins();

    // Check credentials (allows 'admin' / 'admin123' or any admin in the DB)
    const match = admins.find((a) => a.username.toLowerCase() === trimmedUser && a.isActive);

    if (!match) {
      // If logging in as initial admin credentials
      if (trimmedUser === 'admin' && (password === 'admin123' || password === 'admin')) {
        const defaultAdmin: AdminUser = {
          _id: 'admin-1',
          name: 'Vana Founder (Main Admin)',
          username: 'admin',
          email: 'owner@vanaartisan.com',
          role: 'main_admin',
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        const generatedToken = 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        setAdmin(defaultAdmin);
        setToken(generatedToken);
        return { success: true };
      }
      return { success: false, message: 'Invalid username or inactive admin account.' };
    }

    // Verified admin user
    const updatedAdmin: AdminUser = {
      ...match,
      lastLogin: new Date().toISOString()
    };
    storageService.saveAdmin(updatedAdmin);

    const generatedToken = 'jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    setAdmin(updatedAdmin);
    setToken(generatedToken);
    return { success: true };
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('vana_admin_auth_user');
    localStorage.removeItem('vana_admin_jwt_token');
  };

  const isAuthenticated = Boolean(admin && token);
  const isMainAdmin = admin?.role === 'main_admin';

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated,
        isMainAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
