import axios from 'axios';

// Create axios instance for admin API
const adminAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const getDashboardStats = () => adminAPI.get('/admin/dashboard/stats');

// Users API
export const getUsers = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return adminAPI.get(`/admin/users?${queryParams.toString()}`);
};

export const getUserById = (userId) => adminAPI.get(`/admin/users/${userId}`);

export const updateUser = (userId, userData) => adminAPI.put(`/admin/users/${userId}`, userData);

export const deleteUser = (userId) => adminAPI.delete(`/admin/users/${userId}`);

// Products API
export const getProducts = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return adminAPI.get(`/admin/products?${queryParams.toString()}`);
};

export const getProductById = (productId) => adminAPI.get(`/admin/products/${productId}`);

export const createProduct = (productData) => adminAPI.post('/admin/products', productData);

export const updateProduct = (productId, productData) => adminAPI.put(`/admin/products/${productId}`, productData);

export const deleteProduct = (productId) => adminAPI.delete(`/admin/products/${productId}`);

// Orders API
export const getOrders = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return adminAPI.get(`/admin/orders?${queryParams.toString()}`);
};

export const getOrderById = (orderId) => adminAPI.get(`/admin/orders/${orderId}`);

export const updateOrderStatus = (orderId, statusData) => adminAPI.put(`/admin/orders/${orderId}/status`, statusData);

// Chatbot API
export const getChatbotConversations = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return adminAPI.get(`/admin/chatbot/conversations?${queryParams.toString()}`);
};

// System Settings API
export const getSystemSettings = () => adminAPI.get('/admin/settings');

export const updateSystemSettings = (settings) => adminAPI.put('/admin/settings', settings);

// Default service export for convenience
const adminAPIService = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getChatbotConversations,
  getSystemSettings,
  updateSystemSettings
};

export default adminAPIService;
