const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const paymentRoutes = require('./payment');
const chatbotRoutes = require('./chatbot');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VHA Atelier API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/payment', paymentRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`
  });
});

module.exports = router;
