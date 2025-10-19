# 🚀 Hướng dẫn kết nối với GitHub

## Bước 1: Tạo repository trên GitHub

1. Truy cập https://github.com và đăng nhập
2. Nhấn nút "New" hoặc "+" ở góc trên bên phải
3. Điền thông tin:
   - **Repository name**: `vha-atelier`
   - **Description**: `E-commerce website for fashion clothing with AI chatbot integration`
   - **Visibility**: Public
   - **KHÔNG** tích "Add a README file"
   - **KHÔNG** tích "Add .gitignore"
4. Nhấn "Create repository"

## Bước 2: Kết nối local repository với GitHub

Sau khi tạo repository, chạy các lệnh sau (thay `YOUR_USERNAME` bằng username GitHub của bạn):

```bash
# Thêm remote origin
git remote add origin https://github.com/YOUR_USERNAME/vha-atelier.git

# Push code lên GitHub
git push -u origin main
```

## Bước 3: Xác nhận

Sau khi push thành công, bạn có thể:
- Truy cập https://github.com/YOUR_USERNAME/vha-atelier
- Xem code đã được upload
- Chia sẻ repository với người khác

## Lưu ý

- Thay `YOUR_USERNAME` bằng username GitHub thực tế của bạn
- Nếu gặp lỗi authentication, có thể cần setup GitHub Personal Access Token
- Repository sẽ có tất cả code hiện tại của dự án
