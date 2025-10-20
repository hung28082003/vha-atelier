# AI Setup Guide - Hugging Face & Ollama

## 🎯 **CHỈ SỬ DỤNG 2 AI PROVIDERS MIỄN PHÍ**

### **🆓 1. FALLBACK (Mặc định)**
- **Chi phí**: Miễn phí 100%
- **Setup**: Không cần gì
- **Chất lượng**: Responses cơ bản

```env
AI_PROVIDER=fallback
```

---

### **🆓 2. OLLAMA (Local AI)**
- **Chi phí**: Miễn phí 100%
- **Ưu điểm**: Chạy local, privacy cao, không cần internet
- **Setup**: 5 phút

#### **Cài đặt Ollama:**
```bash
# Windows
winget install Ollama.Ollama

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

#### **Download Model:**
```bash
# Llama 2 (Recommended)
ollama pull llama2

# Hoặc Mistral (Nhanh hơn)
ollama pull mistral
```

#### **Cấu hình:**
```env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

---

### **🆓 3. HUGGING FACE (Cloud AI)**
- **Chi phí**: Miễn phí (1K requests/day)
- **Ưu điểm**: Không cần cài đặt, API đơn giản
- **Setup**: 2 phút

#### **Lấy API Key:**
1. Truy cập: https://huggingface.co/
2. Đăng ký tài khoản
3. Vào **Settings** → **Access Tokens**
4. Tạo token mới

#### **Cấu hình:**
```env
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_your-token-here
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

---

## 🚀 **QUICK SETUP**

### **Option 1: Fallback (Ngay lập tức)**
```env
AI_PROVIDER=fallback
```

### **Option 2: Ollama (5 phút)**
```bash
# 1. Cài đặt
winget install Ollama.Ollama

# 2. Download model
ollama pull llama2

# 3. Cấu hình
AI_PROVIDER=ollama
OLLAMA_MODEL=llama2
```

### **Option 3: Hugging Face (2 phút)**
```bash
# 1. Đăng ký tại https://huggingface.co/
# 2. Lấy API key
# 3. Cấu hình
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your-token
```

---

## 📊 **SO SÁNH**

| Provider | Chi phí | Setup | Chất lượng | Privacy |
|----------|---------|-------|------------|---------|
| **Fallback** | $0 | 0 phút | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ollama** | $0 | 5 phút | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Hugging Face** | $0 | 2 phút | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 **KHUYẾN NGHỊ**

### **Development:**
- **Fallback** - Test nhanh
- **Ollama** - Local development

### **Production:**
- **Ollama** - Privacy cao, không giới hạn
- **Hugging Face** - Dễ setup, cloud-based

### **Demo/Portfolio:**
- **Fallback** - Không cần setup
- **Ollama** - Showcase local AI

---

## 🔧 **TESTING**

```bash
# Test chatbot
curl -X POST http://localhost:5000/api/chatbot/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Xin chào, bạn có thể tư vấn cho tôi không?"}'
```

---

## 🚨 **TROUBLESHOOTING**

### **Ollama không chạy:**
```bash
# Khởi động Ollama
ollama serve

# Kiểm tra models
ollama list

# Test model
ollama run llama2 "Hello"
```

### **Hugging Face rate limit:**
- Đợi 1 giờ
- Upgrade account
- Sử dụng model khác

### **API key không hoạt động:**
- Kiểm tra key có đúng không
- Kiểm tra model name
- Thử fallback

---

## 💡 **TIPS**

1. **Bắt đầu với Fallback** để test nhanh
2. **Upgrade lên Ollama** cho development
3. **Sử dụng Hugging Face** cho demo cloud
4. **Ollama tốt nhất** cho production (privacy + unlimited)

---

**🎉 Chỉ cần 2 providers miễn phí để có chatbot AI hoàn chỉnh!**
