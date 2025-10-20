# Cloudinary Setup Guide

## 🖼️ **THIẾT LẬP CLOUDINARY CHO DỰ ÁN**

### **📊 Thông tin Cloudinary của bạn:**
- **Cloud Name**: `dptntkysy`
- **API Key**: `593593297549586`
- **API Secret**: `KDxMdHkyQpySyyH...` (cần lấy đầy đủ)

---

## 🔑 **BƯỚC 1: LẤY API SECRET ĐẦY ĐỦ**

1. **Truy cập**: https://cloudinary.com/console
2. **Đăng nhập** tài khoản Cloudinary
3. **Vào "Settings"** → **"API Keys"**
4. **Tìm API Key** `593593297549586`
5. **Click vào dấu "..."** ở cuối dòng
6. **Chọn "View"** hoặc **"Copy"**
7. **Copy API Secret đầy đủ**

---

## 🔧 **BƯỚC 2: CẬP NHẬT CONFIG.ENV**

Thay thế trong `backend/config.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dptntkysy
CLOUDINARY_API_KEY=593593297549586
CLOUDINARY_API_SECRET=YOUR_FULL_API_SECRET_HERE
```

**⚠️ Lưu ý**: Thay `YOUR_FULL_API_SECRET_HERE` bằng API Secret đầy đủ từ Cloudinary console.

---

## 🧪 **BƯỚC 3: TEST CLOUDINARY**

```bash
# Test Cloudinary connection
cd backend
node -e "
const cloudinary = require('cloudinary').v2;
require('dotenv').config({path: './config.env'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.ping()
  .then(result => console.log('✅ Cloudinary connected!'))
  .catch(err => console.log('❌ Cloudinary failed:', err.message));
"
```

---

## 📁 **BƯỚC 4: CÀI ĐẶT PACKAGE**

```bash
# Cài đặt Cloudinary package
cd backend
npm install cloudinary
```

---

## 🚀 **SỬ DỤNG TRONG DỰ ÁN**

Cloudinary sẽ được sử dụng cho:

### **✅ Product Images:**
- Upload ảnh sản phẩm
- Resize tự động
- Optimize cho web
- CDN delivery

### **✅ User Avatars:**
- Upload avatar người dùng
- Crop và resize
- Multiple formats

### **✅ Category Images:**
- Upload ảnh danh mục
- Banner images
- Thumbnail generation

---

## 🔧 **CẤU HÌNH CLOUDINARY**

### **Upload Settings:**
```javascript
// Auto-optimization
cloudinary.uploader.upload(image, {
  folder: 'vha-atelier/products',
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  transformation: [
    { width: 800, height: 800, crop: 'limit' },
    { quality: 'auto' },
    { format: 'auto' }
  ]
});
```

### **Image Transformations:**
- **Thumbnail**: 150x150
- **Medium**: 400x400
- **Large**: 800x800
- **Banner**: 1200x400

---

## 📊 **CLOUDINARY FREE TIER**

### **Limits:**
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: 500/month

### **Features:**
- ✅ Image optimization
- ✅ Auto-format (WebP, AVIF)
- ✅ Responsive images
- ✅ CDN delivery
- ✅ Image transformations

---

## 🚨 **TROUBLESHOOTING**

### **Lỗi "Invalid credentials":**
- Kiểm tra Cloud Name, API Key, API Secret
- Đảm bảo API Secret đầy đủ

### **Lỗi "Upload failed":**
- Kiểm tra file size (max 10MB)
- Kiểm tra file format (jpg, png, gif, webp)

### **Lỗi "Quota exceeded":**
- Kiểm tra usage trong Cloudinary console
- Upgrade plan nếu cần

---

## 🎯 **BEST PRACTICES**

### **Security:**
- Không commit API Secret vào Git
- Sử dụng environment variables
- Restrict uploads by file type

### **Performance:**
- Sử dụng auto-optimization
- Lazy loading cho images
- CDN delivery

### **Cost Optimization:**
- Compress images trước khi upload
- Sử dụng appropriate sizes
- Monitor usage

---

## 📋 **CHECKLIST**

- [ ] Lấy API Secret đầy đủ từ Cloudinary console
- [ ] Cập nhật `CLOUDINARY_API_SECRET` trong config.env
- [ ] Cài đặt `cloudinary` package
- [ ] Test connection
- [ ] Upload test image

---

**🎉 Cloudinary setup hoàn tất! Dự án có thể upload và optimize images!**
