import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('as_admin_token');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.success && ['SUPER_ADMIN', 'REVIEWER'].includes(res.data.user.role)) {
        setAdmin(res.data.user);
      } else {
        localStorage.removeItem('as_admin_token');
        setAdmin(null);
      }
    } catch (err) {
      console.error('Admin auth check failed:', err);
      localStorage.removeItem('as_admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      if (!['SUPER_ADMIN', 'REVIEWER'].includes(res.data.user.role)) {
        throw new Error('Access denied. Administrator or Reviewer role required.');
      }
      localStorage.setItem('as_admin_token', res.data.token);
      setAdmin(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('as_admin_token');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, checkAdminAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
