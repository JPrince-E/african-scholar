import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://african-scholar-api.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('as_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      // localStorage.removeItem('as_token');
    }
    return Promise.reject(error);
  }
);

export default api;
