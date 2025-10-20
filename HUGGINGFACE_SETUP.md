# Hugging Face Setup Guide

## 🤖 **THIẾT LẬP HUGGING FACE CHO AI CHATBOT**

### **📊 Thông tin:**

- **Chi phí**: Miễn phí
- **Giới hạn**: 1,000 requests/day
- **Models**: DialoGPT, GPT-2, BlenderBot
- **Setup**: 2 phút

---

## 🚀 **HƯỚNG DẪN TỪNG BƯỚC**

### **BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN**

1. **Truy cập**: https://huggingface.co/
2. **Click "Sign Up"**
3. **Điền thông tin**:
   ```
   Username: your-username
   Email: your-email@gmail.com
   Password: your-password
   ```
4. **Verify email** (kiểm tra email)
5. **Complete profile** (tùy chọn)

---

### **BƯỚC 2: TẠO ACCESS TOKEN**

1. **Đăng nhập** vào https://huggingface.co/
2. **Click avatar** (góc phải trên)
3. **Chọn "Settings"**
4. **Vào "Access Tokens"** (menu trái)
5. **Click "New token"**
6. **Điền thông tin**:
   ```
   Name: VHA Atelier
   Type: Read
   ```
7. **Click "Generate a token"**
8. **Copy token** (bắt đầu với `hf_`)

---

### **BƯỚC 3: CẬP NHẬT CONFIG.ENV**

Thay thế trong `backend/config.env`:

```env
# AI Provider Configuration
AI_PROVIDER=huggingface

# Hugging Face Configuration
HUGGINGFACE_API_KEY=hf_your_actual_token_here
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

**⚠️ Lưu ý**:

- Thay `hf_your_actual_token_here` bằng token thực tế
- Token bắt đầu với `hf_`

---

### **BƯỚC 4: TEST CONNECTION**

```bash
# Test Hugging Face
cd backend
node -e "
const axios = require('axios');
require('dotenv').config({path: './config.env'});

const testHuggingFace = async () => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        inputs: 'Hello, how are you?',
        parameters: {
          max_length: 50,
          temperature: 0.7
        }
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.HUGGINGFACE_API_KEY}\`
        }
      }
    );

    console.log('✅ Hugging Face connected!');
    console.log('🤖 Response:', response.data[0].generated_text);
  } catch (error) {
    console.log('❌ Hugging Face failed:', error.response?.data?.error || error.message);
  }
};

testHuggingFace();
"
```

---

## 📊 **HUGGING FACE MODELS**

### **Available Models:**

- **`microsoft/DialoGPT-medium`** - Conversational (Recommended)
- **`gpt2`** - Text generation
- **`facebook/blenderbot-400M-distill`** - Chatbot
- **`microsoft/DialoGPT-small`** - Faster, smaller

### **Model Comparison:**

| Model           | Size | Speed  | Quality    | Use Case        |
| --------------- | ---- | ------ | ---------- | --------------- |
| DialoGPT-medium | 345M | Medium | ⭐⭐⭐⭐   | Chatbot         |
| DialoGPT-small  | 117M | Fast   | ⭐⭐⭐     | Quick responses |
| GPT-2           | 124M | Fast   | ⭐⭐⭐     | Text generation |
| BlenderBot      | 400M | Slow   | ⭐⭐⭐⭐⭐ | Advanced chat   |

---

## 🚨 **TROUBLESHOOTING**

### **Lỗi "Invalid token":**

- Kiểm tra token có đúng không
- Đảm bảo token bắt đầu với `hf_`
- Kiểm tra token có quyền "Read"

### **Lỗi "Rate limit exceeded":**

- Đã vượt quá 1,000 requests/day
- Đợi 24h hoặc upgrade account
- Sử dụng model khác

### **Lỗi "Model not found":**

- Kiểm tra model name có đúng không
- Thử model khác
- Kiểm tra model có available không

### **Lỗi "Connection timeout":**

- Kiểm tra internet connection
- Thử lại sau vài phút
- Kiểm tra Hugging Face status

---

## 📋 **USAGE LIMITS**

### **Free Tier:**

- **Requests**: 1,000/day
- **Models**: Public models only
- **Speed**: Standard
- **Support**: Community

### **Pro Tier ($9/month):**

- **Requests**: 10,000/day
- **Models**: All models
- **Speed**: Faster
- **Support**: Priority

---

## 🎯 **BEST PRACTICES**

### **Performance:**

- Sử dụng model phù hợp với use case
- Cache responses khi có thể
- Monitor usage

### **Cost Optimization:**

- Sử dụng model nhỏ hơn cho simple tasks
- Implement fallback to local models
- Batch requests khi có thể

### **Error Handling:**

- Implement retry logic
- Fallback to other providers
- Graceful degradation

---

## 🔧 **ADVANCED CONFIGURATION**

### **Custom Model:**

```env
HUGGINGFACE_MODEL=your-username/your-model
```

### **Multiple Models:**

```javascript
const models = {
  chat: "microsoft/DialoGPT-medium",
  text: "gpt2",
  advanced: "facebook/blenderbot-400M-distill",
};
```

---

## 🚀 **NEXT STEPS**

1. **Test chatbot** với Hugging Face
2. **Monitor usage** trong dashboard
3. **Optimize responses** cho fashion domain
4. **Implement fallback** to other providers

---

**🎉 Hugging Face setup hoàn tất! AI chatbot sẵn sàng hoạt động!**
