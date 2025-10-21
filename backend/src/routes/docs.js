const express = require('express');
const router = express.Router();

// API Documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VHA Atelier API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Đăng ký tài khoản',
        'POST /api/auth/login': 'Đăng nhập',
        'POST /api/auth/logout': 'Đăng xuất',
        'GET /api/auth/profile': 'Lấy thông tin profile',
        'PUT /api/auth/profile': 'Cập nhật profile',
        'POST /api/auth/forgot-password': 'Quên mật khẩu',
        'POST /api/auth/reset-password': 'Đặt lại mật khẩu'
      },
      products: {
        'GET /api/products': 'Lấy danh sách sản phẩm',
        'GET /api/products/:id': 'Lấy chi tiết sản phẩm',
        'GET /api/products/featured': 'Sản phẩm nổi bật',
        'GET /api/products/new': 'Sản phẩm mới',
        'GET /api/products/sale': 'Sản phẩm giảm giá'
      },
      categories: {
        'GET /api/categories': 'Lấy danh sách danh mục',
        'GET /api/categories/:id': 'Lấy chi tiết danh mục'
      },
      cart: {
        'GET /api/cart': 'Lấy giỏ hàng',
        'POST /api/cart': 'Thêm vào giỏ hàng',
        'PUT /api/cart/:id': 'Cập nhật giỏ hàng',
        'DELETE /api/cart/:id': 'Xóa khỏi giỏ hàng'
      },
      orders: {
        'GET /api/orders': 'Lấy danh sách đơn hàng',
        'GET /api/orders/:id': 'Lấy chi tiết đơn hàng',
        'POST /api/orders': 'Tạo đơn hàng',
        'PUT /api/orders/:id/cancel': 'Hủy đơn hàng'
      },
      chatbot: {
        'POST /api/chatbot/start': 'Bắt đầu cuộc trò chuyện',
        'POST /api/chatbot/message': 'Gửi tin nhắn'
      },
      admin: {
        'GET /api/admin/dashboard/stats': 'Thống kê dashboard',
        'GET /api/admin/users': 'Quản lý người dùng',
        'GET /api/admin/products': 'Quản lý sản phẩm',
        'GET /api/admin/orders': 'Quản lý đơn hàng',
        'GET /api/admin/settings': 'Cài đặt hệ thống'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Tất cả API admin yêu cầu token admin'
    },
    examples: {
      register: {
        url: 'POST /api/auth/register',
        body: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          password: 'password123'
        }
      },
      login: {
        url: 'POST /api/auth/login',
        body: {
          email: 'user@example.com',
          password: 'password123'
        }
      },
      createProduct: {
        url: 'POST /api/admin/products',
        headers: {
          'Authorization': 'Bearer <admin_token>',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Áo sơ mi nam',
          description: 'Áo sơ mi nam cao cấp',
          price: 500000,
          stock: 50,
          category: 'category_id',
          brand: 'VHA Atelier',
          sizes: ['S', 'M', 'L'],
          colors: ['Trắng', 'Xanh'],
          tags: ['thời trang', 'nam']
        }
      }
    }
  });
});

module.exports = router;
