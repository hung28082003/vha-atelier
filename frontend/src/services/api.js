import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: (limit) => api.get('/products/featured', { params: { limit } }),
  getNewProducts: (limit) => api.get('/products/new', { params: { limit } }),
  getOnSaleProducts: (limit) => api.get('/products/sale', { params: { limit } }),
  getTopSellingProducts: (limit) => api.get('/products/top-selling', { params: { limit } }),
  searchProducts: (query, params) => api.get('/products/search', { params: { q: query, ...params } }),
  getProductsByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  addReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (id) => api.get(`/categories/${id}`),
  getCategoryTree: () => api.get('/categories/tree'),
  getFeaturedCategories: (limit) => api.get('/categories/featured', { params: { limit } }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemData) => api.post('/cart/add', itemData),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  mergeCarts: (guestCartItems) => api.post('/cart/merge', { guestCartItems }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: (params) => api.get('/orders/my-orders', { params }),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  returnOrder: (id, reason) => api.post(`/orders/${id}/return`, { reason }),
};

// Payment API
export const paymentAPI = {
  generatePaymentQR: (orderId, paymentMethod) => api.post(`/payment/${orderId}/qr`, { paymentMethod }),
  verifyPayment: (orderId, transactionId) => api.post(`/payment/${orderId}/verify`, { transactionId }),
  getPaymentStatus: (orderId) => api.get(`/payment/${orderId}/status`),
  getPaymentReceipt: (orderId) => api.get(`/payment/${orderId}/receipt`),
  cancelPayment: (orderId, reason) => api.post(`/payment/${orderId}/cancel`, { reason }),
};

// Chatbot API
export const chatbotAPI = {
  startConversation: () => api.post('/chatbot/start'),
  sendMessage: (message, sessionId) => api.post('/chatbot/message', { message, sessionId }),
  getConversationHistory: (sessionId, limit) => api.get('/chatbot/history', { params: { sessionId, limit } }),
  getUserConversations: (limit) => api.get('/chatbot/conversations', { params: { limit } }),
  updateUserPreferences: (preferences) => api.put('/chatbot/preferences', { preferences }),
  getProductRecommendations: (limit) => api.get('/chatbot/recommendations', { params: { limit } }),
  endConversation: (sessionId, satisfaction) => api.post('/chatbot/end', { sessionId, satisfaction }),
};

// File Upload API
export const uploadAPI = {
  uploadProductImages: (formData) => api.post('/upload/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadCategoryImage: (formData) => api.post('/upload/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadAvatar: (formData) => api.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

export default api;
