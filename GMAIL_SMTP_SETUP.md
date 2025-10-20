# Gmail SMTP Setup Guide

## 📧 **THIẾT LẬP GMAIL SMTP CHO DỰ ÁN**

### **⚠️ QUAN TRỌNG: Gmail yêu cầu App Password**

Gmail không cho phép sử dụng mật khẩu thông thường cho SMTP. Bạn cần tạo **App Password** để bảo mật.

---

## 🔐 **BƯỚC 1: BẬT 2-FACTOR AUTHENTICATION**

1. **Truy cập**: https://myaccount.google.com/
2. **Đăng nhập** với tài khoản `viethung28082003x@gmail.com`
3. **Vào "Security"** (Bảo mật)
4. **Tìm "2-Step Verification"** (Xác minh 2 bước)
5. **Bật 2-Step Verification** nếu chưa có
6. **Làm theo hướng dẫn** để thiết lập

---

## 🔑 **BƯỚC 2: TẠO APP PASSWORD**

1. **Vào "Security"** → **"2-Step Verification"**
2. **Cuộn xuống** tìm **"App passwords"**
3. **Click "App passwords"**
4. **Chọn app**: "Mail"
5. **Chọn device**: "Other (Custom name)"
6. **Nhập tên**: "VHA Atelier"
7. **Click "Generate"**
8. **Copy password 16 ký tự** (ví dụ: `abcd efgh ijkl mnop`)

---

## 🔧 **BƯỚC 3: CẬP NHẬT CONFIG.ENV**

Thay thế trong `backend/config.env`:

```env
# Email Configuration
EMAIL_USER=viethung28082003x@gmail.com
EMAIL_PASS=YOUR_16_CHARACTER_APP_PASSWORD_HERE
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

**⚠️ Lưu ý**: 
- Sử dụng **App Password** (16 ký tự), KHÔNG phải mật khẩu Gmail thông thường
- Không có dấu cách trong App Password

---

## 🧪 **BƯỚC 4: TEST EMAIL**

```bash
# Test email service
cd backend
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config({path: './config.env'});

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email setup failed:', error.message);
  } else {
    console.log('✅ Email setup successful!');
  }
});
"
```

---

## 🚨 **TROUBLESHOOTING**

### **Lỗi "Invalid login":**
- Kiểm tra App Password có đúng không
- Đảm bảo đã bật 2-Step Verification
- Kiểm tra email có đúng không

### **Lỗi "Less secure app access":**
- Gmail đã tắt tính năng này
- Bắt buộc phải dùng App Password

### **Lỗi "Connection timeout":**
- Kiểm tra internet connection
- Thử port 465 với secure: true

---

## 📋 **THÔNG TIN CẤU HÌNH**

### **Gmail SMTP Settings:**
```
Host: smtp.gmail.com
Port: 587 (TLS) hoặc 465 (SSL)
Security: STARTTLS hoặc SSL
Username: viethung28082003x@gmail.com
Password: [16-character App Password]
```

### **Alternative Settings (nếu port 587 không hoạt động):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

---

## 🎯 **SỬ DỤNG TRONG DỰ ÁN**

Email sẽ được sử dụng cho:
- ✅ **User Registration** - Gửi email xác thực
- ✅ **Password Reset** - Gửi link reset password
- ✅ **Order Confirmation** - Xác nhận đơn hàng
- ✅ **Newsletter** - Gửi tin tức, khuyến mãi

---

## 💡 **TIPS**

1. **App Password** chỉ hiển thị 1 lần, hãy lưu lại
2. **Không share** App Password với ai
3. **Có thể tạo nhiều** App Password cho các app khác nhau
4. **Có thể xóa** App Password cũ khi không dùng

---

**🎉 Sau khi setup xong, dự án sẽ có thể gửi email tự động!**
