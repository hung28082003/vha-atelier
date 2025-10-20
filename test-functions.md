# 🧪 **HƯỚNG DẪN TEST CÁC CHỨC NĂNG VHA ATELIER**

## 🚀 **KHỞI ĐỘNG HỆ THỐNG**

### **1. Khởi động Backend & Frontend:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm start
```

### **2. Truy cập ứng dụng:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🔐 **TEST AUTHENTICATION**

### **1. Đăng ký tài khoản mới:**
- Truy cập: http://localhost:3000/register
- Điền thông tin:
  - Họ và tên: `Nguyễn Văn A`
  - Email: `test@example.com`
  - Mật khẩu: `123456`
  - Xác nhận mật khẩu: `123456`
- Click "Đăng ký"
- **Kết quả mong đợi**: Thông báo thành công, chuyển về trang chủ

### **2. Đăng nhập:**
- Truy cập: http://localhost:3000/login
- Điền thông tin:
  - Email: `test@example.com`
  - Mật khẩu: `123456`
- Click "Đăng nhập"
- **Kết quả mong đợi**: Đăng nhập thành công, hiển thị header với profile icon

### **3. Test JWT Token:**
- Mở Developer Tools (F12)
- Vào tab Application > Local Storage
- Kiểm tra có `accessToken` và `refreshToken`

---

## 🏠 **TEST TRANG CHỦ**

### **1. Kiểm tra giao diện:**
- Header với logo VHA Atelier
- Navigation menu (Trang Chủ, Nữ, Nam, Phụ Kiện, Khuyến Mãi)
- Hero section với text "Style"
- Product showcase
- Footer với thông tin liên hệ

### **2. Test responsive:**
- Thu nhỏ browser để test mobile view
- Kiểm tra hamburger menu trên mobile

---

## 🛍️ **TEST SẢN PHẨM**

### **1. Trang sản phẩm:**
- Click vào "Nữ" hoặc "Nam" trong menu
- **URL**: http://localhost:3000/products?category=women
- **Kết quả mong đợi**: Hiển thị danh sách sản phẩm

### **2. Chi tiết sản phẩm:**
- Click vào một sản phẩm
- **Kết quả mong đợi**: Hiển thị thông tin chi tiết, hình ảnh, giá, mô tả

### **3. Thêm vào giỏ hàng:**
- Chọn size, màu sắc
- Click "Thêm vào giỏ hàng"
- **Kết quả mong đợi**: Thông báo thành công, số lượng trong giỏ hàng tăng

---

## 🛒 **TEST GIỎ HÀNG**

### **1. Xem giỏ hàng:**
- Click icon giỏ hàng ở header
- **URL**: http://localhost:3000/cart
- **Kết quả mong đợi**: Hiển thị sản phẩm đã thêm

### **2. Cập nhật số lượng:**
- Thay đổi số lượng sản phẩm
- **Kết quả mong đợi**: Tổng tiền cập nhật theo

### **3. Xóa sản phẩm:**
- Click nút "Xóa" bên cạnh sản phẩm
- **Kết quả mong đợi**: Sản phẩm bị xóa khỏi giỏ hàng

---

## 💳 **TEST THANH TOÁN**

### **1. Checkout:**
- Trong giỏ hàng, click "Thanh toán"
- **URL**: http://localhost:3000/checkout
- **Kết quả mong đợi**: Form thông tin giao hàng

### **2. Điền thông tin:**
- Thông tin giao hàng
- Chọn phương thức thanh toán: QR Code
- Click "Đặt hàng"

### **3. QR Code Payment:**
- **Kết quả mong đợi**: Hiển thị QR code để thanh toán
- Test với QR code giả

---

## 👤 **TEST USER DASHBOARD**

### **1. Truy cập Dashboard:**
- Click icon profile ở header
- **URL**: http://localhost:3000/profile
- **Kết quả mong đợi**: Hiển thị User Dashboard với 6 tabs

### **2. Test Profile Tab:**
- Xem thông tin cá nhân
- Click "Chỉnh sửa"
- Cập nhật thông tin (tên, số điện thoại, ngày sinh, giới tính)
- Click "Lưu thay đổi"
- **Kết quả mong đợi**: Thông báo thành công, thông tin được cập nhật

### **3. Test Orders Tab:**
- Xem lịch sử đơn hàng
- **Kết quả mong đợi**: Hiển thị danh sách đơn hàng (nếu có)

### **4. Test Wishlist Tab:**
- Xem danh sách yêu thích
- **Kết quả mong đợi**: Hiển thị sản phẩm yêu thích (nếu có)

### **5. Test Addresses Tab:**
- Click "Thêm địa chỉ"
- Điền thông tin địa chỉ
- Click "Lưu"
- **Kết quả mong đợi**: Địa chỉ được thêm vào danh sách

### **6. Test Settings Tab:**
- Thay đổi cài đặt thông báo
- Chọn ngôn ngữ và tiền tệ
- **Kết quả mong đợi**: Cài đặt được lưu

### **7. Test Security Tab:**
- Click "Đổi mật khẩu"
- Nhập mật khẩu hiện tại và mật khẩu mới
- Click "Cập nhật mật khẩu"
- **Kết quả mong đợi**: Thông báo thành công

---

## 🤖 **TEST AI CHATBOT**

### **1. Mở Chatbot:**
- Click icon chatbot ở góc phải màn hình
- **Kết quả mong đợi**: Widget chatbot mở ra

### **2. Test conversation:**
- Gửi tin nhắn: "Xin chào"
- **Kết quả mong đợi**: Bot phản hồi (fallback mode)

### **3. Test product recommendation:**
- Gửi tin nhắn: "Tôi muốn mua áo sơ mi"
- **Kết quả mong đợi**: Bot đưa ra gợi ý sản phẩm

---

## 📱 **TEST RESPONSIVE DESIGN**

### **1. Desktop (1920x1080):**
- Kiểm tra layout đầy đủ
- Navigation menu hiển thị đầy đủ

### **2. Tablet (768x1024):**
- Kiểm tra responsive breakpoints
- Menu có thể thu gọn

### **3. Mobile (375x667):**
- Hamburger menu
- Touch-friendly buttons
- Optimized layout

---

## 🔧 **TEST API ENDPOINTS**

### **1. Health Check:**
```bash
curl http://localhost:5000/api/health
```

### **2. Authentication:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### **3. User Profile:**
```bash
# Get Profile (cần token)
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 **KIỂM TRA LỖI THƯỜNG GẶP**

### **1. Backend không khởi động:**
- Kiểm tra port 5000 có bị chiếm không
- Kiểm tra MongoDB connection
- Kiểm tra environment variables

### **2. Frontend không load:**
- Kiểm tra port 3000
- Kiểm tra console errors
- Kiểm tra network requests

### **3. Authentication lỗi:**
- Kiểm tra JWT secret trong config.env
- Kiểm tra token expiration
- Kiểm tra CORS settings

### **4. Database lỗi:**
- Kiểm tra MongoDB Atlas connection
- Kiểm tra credentials
- Kiểm tra network connectivity

---

## ✅ **CHECKLIST HOÀN THÀNH**

- [ ] Backend khởi động thành công
- [ ] Frontend khởi động thành công
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập
- [ ] Xem trang chủ
- [ ] Browse sản phẩm
- [ ] Xem chi tiết sản phẩm
- [ ] Thêm vào giỏ hàng
- [ ] Xem giỏ hàng
- [ ] Checkout
- [ ] QR Code payment
- [ ] User Dashboard - Profile
- [ ] User Dashboard - Orders
- [ ] User Dashboard - Wishlist
- [ ] User Dashboard - Addresses
- [ ] User Dashboard - Settings
- [ ] User Dashboard - Security
- [ ] AI Chatbot
- [ ] Responsive design
- [ ] API endpoints

---

## 🎯 **KẾT QUẢ MONG ĐỢI**

Sau khi test xong, bạn sẽ có:
- ✅ Hệ thống e-commerce hoàn chỉnh
- ✅ User Dashboard đầy đủ tính năng
- ✅ AI Chatbot hoạt động
- ✅ Responsive design
- ✅ API endpoints hoạt động
- ✅ Database integration
- ✅ Authentication system

**🎉 Chúc bạn test thành công!**
