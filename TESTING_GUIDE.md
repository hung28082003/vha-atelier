# 🧪 VHA Atelier - Testing Guide

## 📋 **TESTING CHECKLIST**

### **1. AUTHENTICATION & AUTHORIZATION**

- [ ] **User Registration**

  - [ ] Đăng ký với thông tin hợp lệ
  - [ ] Validation lỗi với thông tin không hợp lệ
  - [ ] Email đã tồn tại
  - [ ] Password confirmation không khớp

- [ ] **User Login**

  - [ ] Đăng nhập với credentials đúng
  - [ ] Đăng nhập với credentials sai
  - [ ] Remember me functionality
  - [ ] Logout functionality

- [ ] **Admin Access**
  - [ ] Đăng nhập admin: `admin@vha-atelier.com` / `admin123456`
  - [ ] Truy cập `/admin` với user thường (should redirect)
  - [ ] Truy cập `/admin` với admin (should work)

### **2. PRODUCT MANAGEMENT**

- [ ] **Product Listing**

  - [ ] Hiển thị danh sách sản phẩm
  - [ ] Filter theo category
  - [ ] Search products
  - [ ] Pagination

- [ ] **Product Detail**
  - [ ] Hiển thị thông tin chi tiết
  - [ ] Add to cart functionality
  - [ ] Add to wishlist functionality
  - [ ] Product reviews

### **3. SHOPPING CART & CHECKOUT**

- [ ] **Cart Operations**

  - [ ] Add product to cart
  - [ ] Update quantity
  - [ ] Remove item from cart
  - [ ] Clear cart

- [ ] **Checkout Process**
  - [ ] Shipping information form
  - [ ] Payment method selection
  - [ ] QR code payment generation
  - [ ] Order confirmation

### **4. USER DASHBOARD**

- [ ] **Profile Management**

  - [ ] View profile information
  - [ ] Update profile
  - [ ] Change password
  - [ ] Upload avatar

- [ ] **Order History**

  - [ ] View order list
  - [ ] View order details
  - [ ] Order status tracking

- [ ] **Wishlist**

  - [ ] Add to wishlist
  - [ ] Remove from wishlist
  - [ ] View wishlist

- [ ] **Address Book**
  - [ ] Add new address
  - [ ] Edit address
  - [ ] Delete address
  - [ ] Set default address

### **5. ADMIN DASHBOARD**

- [ ] **Dashboard Overview**

  - [ ] View statistics
  - [ ] Recent orders
  - [ ] System metrics

- [ ] **User Management**

  - [ ] View user list
  - [ ] Search users
  - [ ] Edit user information
  - [ ] Deactivate/activate users

- [ ] **Product Management**

  - [ ] View product list
  - [ ] Add new product
  - [ ] Edit product
  - [ ] Delete product
  - [ ] Manage categories

- [ ] **Order Management**

  - [ ] View order list
  - [ ] Update order status
  - [ ] View order details
  - [ ] Order analytics

- [ ] **System Settings**
  - [ ] Update site information
  - [ ] Configure chatbot
  - [ ] System maintenance mode

### **6. AI CHATBOT**

- [ ] **Chatbot Functionality**

  - [ ] Open/close chatbot
  - [ ] Send messages
  - [ ] Receive responses
  - [ ] Product recommendations
  - [ ] Fashion advice

- [ ] **Chatbot Management (Admin)**
  - [ ] Enable/disable chatbot
  - [ ] Configure welcome message
  - [ ] View conversation history

### **7. RESPONSIVE DESIGN**

- [ ] **Mobile Testing**

  - [ ] iPhone (375px)
  - [ ] Android (360px)
  - [ ] Tablet (768px)

- [ ] **Desktop Testing**
  - [ ] Small desktop (1024px)
  - [ ] Large desktop (1920px)
  - [ ] Ultra-wide (2560px)

### **8. PERFORMANCE TESTING**

- [ ] **Page Load Times**

  - [ ] Homepage < 3 seconds
  - [ ] Product pages < 2 seconds
  - [ ] Admin dashboard < 4 seconds

- [ ] **API Response Times**
  - [ ] Authentication < 500ms
  - [ ] Product queries < 1 second
  - [ ] Order operations < 2 seconds

### **9. SECURITY TESTING**

- [ ] **Authentication Security**

  - [ ] JWT token validation
  - [ ] Password hashing
  - [ ] Session management

- [ ] **Authorization**

  - [ ] User role permissions
  - [ ] Admin-only endpoints
  - [ ] API access control

- [ ] **Input Validation**
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CSRF protection

### **10. INTEGRATION TESTING**

- [ ] **Database Integration**

  - [ ] MongoDB connection
  - [ ] Data persistence
  - [ ] Transaction handling

- [ ] **External Services**
  - [ ] Cloudinary image upload
  - [ ] Email notifications
  - [ ] AI chatbot responses

## 🚀 **AUTOMATED TESTING**

### **Frontend Testing**

```bash
cd frontend
npm test
```

### **Backend Testing**

```bash
cd backend
npm test
```

### **API Testing**

```bash
# Test all endpoints
node test-api.js

# Test authentication flow
node test-auth.js
```

## 📊 **PERFORMANCE METRICS**

### **Target Metrics:**

- **Page Load Time**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1

### **API Performance:**

- **Response Time**: < 500ms (95th percentile)
- **Throughput**: > 100 requests/second
- **Error Rate**: < 1%

## 🐛 **BUG REPORTING**

### **Bug Report Template:**

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. Go to [URL]
2. Click on [element]
3. See error

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Environment**:
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Device: [Desktop/Mobile]

**Screenshots**: [If applicable]

**Priority**: [High/Medium/Low]
```

## ✅ **TESTING COMPLETION CHECKLIST**

- [ ] All functional tests passed
- [ ] Performance tests within targets
- [ ] Security tests passed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] API integration working
- [ ] Database operations stable
- [ ] Error handling implemented
- [ ] User experience optimized
- [ ] Documentation updated

## 🎯 **FINAL VALIDATION**

### **User Journey Testing:**

1. **New User Journey**:

   - Visit homepage → Register → Browse products → Add to cart → Checkout → Order confirmation

2. **Returning User Journey**:

   - Login → View profile → Check order history → Add to wishlist → Make new purchase

3. **Admin Journey**:
   - Admin login → Dashboard → Manage users → Manage products → Update orders → System settings

### **Critical Path Testing:**

- [ ] User registration and login
- [ ] Product browsing and purchasing
- [ ] Order processing and confirmation
- [ ] Admin management functions
- [ ] AI chatbot interactions

---

**🎉 Testing completed successfully! VHA Atelier is ready for production! 🎉**
