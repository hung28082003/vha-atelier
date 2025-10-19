const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  getFeaturedCategories
} = require('../controllers/categoryController');
const {
  authenticateToken,
  requireAdmin,
  requireAdminOrModerator
} = require('../middleware/auth');
const {
  validateCategory,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, getCategories);
router.get('/tree', getCategoryTree);
router.get('/featured', getFeaturedCategories);
router.get('/:id', validateObjectId('id'), getCategory);

// Protected routes (Admin/Moderator only)
router.use(authenticateToken);
router.use(requireAdminOrModerator);

router.post('/', validateCategory, createCategory);
router.put('/:id', validateObjectId('id'), validateCategory, updateCategory);
router.delete('/:id', validateObjectId('id'), requireAdmin, deleteCategory);

module.exports = router;
