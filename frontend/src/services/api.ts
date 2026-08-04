import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attache automatiquement le token JWT (stocké par le store d'auth) sur chaque requête.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tawiniya-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
