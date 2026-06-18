/**
 * ReserveIQ - Axios API Instance
 * -------------------------------
 * This configures a shared Axios instance for all API calls.
 * In production, baseURL points to the Spring Boot backend on Railway.
 * An interceptor automatically attaches the JWT token to every request.
 */

import axios from 'axios';

// Create axios instance with backend URL
// When deploying to Railway, replace this with your Railway URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://reserveiq-backend.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('reserveiq_user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - log the user out
      localStorage.removeItem('reserveiq_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
