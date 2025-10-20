# MongoDB Atlas Setup Guide - Chi Tiết

## 🎯 **MONGODB ATLAS (CLOUD - FREE)**

### **📊 Thông tin:**
- **Storage**: 512MB miễn phí
- **Bandwidth**: 1GB/month
- **Connections**: 500 concurrent
- **Chi phí**: $0 (Forever free tier)

---

## 🚀 **HƯỚNG DẪN TỪNG BƯỚC**

### **BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN**

1. **Truy cập**: https://www.mongodb.com/atlas
2. **Click "Try Free"**
3. **Điền thông tin**:
   ```
   Email: your-email@gmail.com
   Password: your-strong-password
   First Name: Your Name
   Last Name: Your Last Name
   Company: VHA Atelier (optional)
   ```
4. **Click "Create your Atlas account"**

---

### **BƯỚC 2: TẠO CLUSTER**

1. **Chọn "Build a Database"**
2. **Chọn "FREE" tier** (M0 Sandbox)
3. **Cloud Provider**: AWS (Recommended)
4. **Region**: 
   - `N. Virginia (us-east-1)` - Tốt nhất
   - `Asia Pacific (ap-southeast-1)` - Gần Việt Nam
5. **Cluster Name**: `vha-atelier-cluster`
6. **Click "Create Cluster"**
7. **Đợi 3-5 phút** để cluster được tạo

---

### **BƯỚC 3: TẠO DATABASE USER**

1. **Chọn "Database Access"** (menu trái)
2. **Click "Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `vha-atelier-user`
5. **Password**: Tạo password mạnh (lưu lại!)
   ```
   Ví dụ: VhaAtelier2024!@#
   ```
6. **Database User Privileges**: 
   - Chọn "Read and write to any database"
7. **Click "Add User"**

---

### **BƯỚC 4: CẤU HÌNH NETWORK ACCESS**

1. **Chọn "Network Access"** (menu trái)
2. **Click "Add IP Address"**
3. **Chọn "Allow Access from Anywhere"**
   ```
   IP Address: 0.0.0.0/0
   Comment: Development access
   ```
4. **Click "Confirm"**

---

### **BƯỚC 5: LẤY CONNECTION STRING**

1. **Chọn "Database"** (menu trái)
2. **Click "Connect"** trên cluster
3. **Chọn "Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy connection string**:
   ```
   mongodb+srv://vha-atelier-user:<password>@vha-atelier-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### **BƯỚC 6: CẬP NHẬT CONFIG.ENV**

Thay thế trong `backend/config.env`:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://vha-atelier-user:YOUR_ACTUAL_PASSWORD@vha-atelier-cluster.xxxxx.mongodb.net/vha-atelier?retryWrites=true&w=majority
```

**⚠️ Lưu ý**: 
- Thay `YOUR_ACTUAL_PASSWORD` bằng password thực tế
- Thay `xxxxx` bằng cluster ID thực tế
- Thêm database name `vha-atelier` trước `?`

---

### **BƯỚC 7: TEST CONNECTION**

```bash
# Test connection
cd backend
node -e "require('dotenv').config({path: './config.env'}); console.log('MongoDB URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Not found')"

# Start backend
npm run dev
```

---

## 🔧 **TROUBLESHOOTING**

### **Lỗi "Authentication failed":**
- Kiểm tra username/password
- Đảm bảo user có quyền "Read and write"

### **Lỗi "Network timeout":**
- Kiểm tra IP whitelist (0.0.0.0/0)
- Kiểm tra internet connection

### **Lỗi "Invalid connection string":**
- Kiểm tra format connection string
- Đảm bảo có database name

### **Lỗi "Cluster not found":**
- Đợi cluster được tạo hoàn tất
- Kiểm tra cluster name

---

## 📊 **THÔNG TIN CLUSTER**

### **Free Tier Limits:**
- **Storage**: 512MB
- **RAM**: Shared
- **CPU**: Shared
- **Connections**: 500
- **Bandwidth**: 1GB/month

### **Upgrade Options:**
- **M2**: $9/month - 2GB storage
- **M5**: $25/month - 5GB storage
- **M10**: $57/month - 10GB storage

---

## 🎯 **BEST PRACTICES**

### **Security:**
- Sử dụng password mạnh
- Whitelist IP cụ thể cho production
- Enable encryption in transit

### **Performance:**
- Chọn region gần nhất
- Sử dụng indexes
- Monitor performance

### **Backup:**
- Free tier có backup tự động
- Point-in-time recovery (paid)

---

## 🚀 **NEXT STEPS**

1. **Test connection** với backend
2. **Create collections** tự động
3. **Seed data** cho development
4. **Monitor usage** trong Atlas dashboard

---

**🎉 MongoDB Atlas setup hoàn tất! Bạn có thể bắt đầu development ngay!**
