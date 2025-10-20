const { body, param, query, validationResult } = require('express-validator');

// Middleware xử lý lỗi validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  
  next();
};

// Validation rules cho User
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Họ và tên là bắt buộc')
    .isLength({ max: 100 })
    .withMessage('Họ và tên không được quá 100 ký tự'),
  
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Giới tính không hợp lệ'),
  
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc'),
  
  handleValidationErrors
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tên không được quá 50 ký tự'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Họ không được quá 50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Giới tính không hợp lệ'),
  
  handleValidationErrors
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validation rules cho Product
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên sản phẩm là bắt buộc')
    .isLength({ max: 100 })
    .withMessage('Tên sản phẩm không được quá 100 ký tự'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Mô tả sản phẩm là bắt buộc')
    .isLength({ max: 2000 })
    .withMessage('Mô tả không được quá 2000 ký tự'),
  
  body('category')
    .isMongoId()
    .withMessage('Danh mục không hợp lệ'),
  
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Thương hiệu là bắt buộc'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá gốc phải là số dương'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải là số nguyên dương'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'inactive', 'out_of_stock'])
    .withMessage('Trạng thái không hợp lệ'),
  
  handleValidationErrors
];

const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tên sản phẩm không được quá 100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Mô tả không được quá 2000 ký tự'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá phải là số dương'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Số lượng tồn kho phải là số nguyên dương'),
  
  handleValidationErrors
];

// Validation rules cho Category
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên danh mục là bắt buộc')
    .isLength({ max: 50 })
    .withMessage('Tên danh mục không được quá 50 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  
  body('parent')
    .optional()
    .isMongoId()
    .withMessage('Danh mục cha không hợp lệ'),
  
  handleValidationErrors
];

// Validation rules cho Order
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Số lượng phải từ 1 đến 10'),
  
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Tên người nhận là bắt buộc'),
  
  body('shippingAddress.phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ là bắt buộc'),
  
  body('shippingAddress.ward')
    .trim()
    .notEmpty()
    .withMessage('Phường/xã là bắt buộc'),
  
  body('shippingAddress.district')
    .trim()
    .notEmpty()
    .withMessage('Quận/huyện là bắt buộc'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Tỉnh/thành phố là bắt buộc'),
  
  body('paymentMethod')
    .isIn(['qr_code', 'cod', 'bank_transfer'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  
  handleValidationErrors
];

// Validation rules cho Cart
const validateCartItem = [
  body('product')
    .isMongoId()
    .withMessage('ID sản phẩm không hợp lệ'),
  
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Số lượng phải từ 1 đến 10'),
  
  body('size')
    .optional()
    .trim(),
  
  body('color')
    .optional()
    .trim(),
  
  handleValidationErrors
];

// Validation rules cho MongoDB ObjectId
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} không hợp lệ`),
  
  handleValidationErrors
];

// Validation rules cho pagination
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số nguyên dương'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Giới hạn phải từ 1 đến 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'price', '-price', 'name', '-name'])
    .withMessage('Thứ tự sắp xếp không hợp lệ'),
  
  handleValidationErrors
];

// Validation rules cho search
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa tìm kiếm phải từ 1 đến 100 ký tự'),
  
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Danh mục không hợp lệ'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá tối thiểu phải là số dương'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Giá tối đa phải là số dương'),
  
  handleValidationErrors
];

// Validation rules cho email
const validateEmail = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validation rules cho password reset
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  handleValidationErrors
];

const validatePasswordResetConfirm = [
  body('token')
    .notEmpty()
    .withMessage('Token là bắt buộc'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validatePasswordChange,
  validateProduct,
  validateProductUpdate,
  validateCategory,
  validateOrder,
  validateCartItem,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateEmail,
  validatePasswordReset,
  validatePasswordResetConfirm
};
