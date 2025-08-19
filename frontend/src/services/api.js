import axios from 'axios';

// The base URL for your NestJS backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1/';

const api = axios.create({
  baseURL: API_URL,
});

// Axios interceptor to automatically attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH ENDPOINTS ---
export const login = (email, password) => api.post('auth/login', { email, password });
export const signup = (userData) => api.post('auth/signup', userData);
export const updatePassword = (passwords) => api.patch('auth/password', passwords);

// --- STORES ENDPOINTS (for Normal User & Admin) ---
export const getStores = (params) => api.get('stores', { params });
export const rateStore = (storeId, rating_value) => api.post(`stores/${storeId}/ratings`, { rating_value });
export const updateRating = (storeId, rating_value) => api.put(`stores/${storeId}/ratings`, { rating_value });

// --- ADMIN ENDPOINTS ---
export const getAdminDashboard = () => api.get('admin/users/dashboard');
export const getAllUsers = (params) => api.get('admin/users', { params });
export const getStoreOwners = () => api.get('admin/users', { params: { role: 'STORE_OWNER' } });
export const adminCreateUser = (userData) => api.post('admin/users', userData);
export const adminCreateStore = (storeData) => api.post('stores', storeData);

// --- STORE OWNER ENDPOINTS ---
export const getOwnerDashboard = () => api.get('stores/dashboard');

export default api;
