import axios from 'axios';

// In production on Vercel, vercel.json routes /api/* → backend/server.js
// so we use a relative URL. In local dev, we hit localhost:5000 directly.
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL in production, explicit in dev
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (window.location.hostname !== 'localhost') return '/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nexora_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexora_token');
      localStorage.removeItem('nexora_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
