# AI Providers Setup Guide

## 🤖 **CÁC PHƯƠNG ÁN AI CHO CHATBOT**

### **🆓 1. FALLBACK (Miễn phí 100%)**

- **Chi phí**: Miễn phí
- **Setup**: Không cần cấu hình gì
- **Chất lượng**: Responses cơ bản, pre-defined
- **Phù hợp**: Demo, testing

```env
AI_PROVIDER=fallback
```

---

### **🆓 2. OLLAMA (Local AI - Miễn phí)**

- **Chi phí**: Miễn phí 100%
- **Ưu điểm**: Chạy local, không cần internet, privacy
- **Setup**: Cài đặt Ollama + download model

#### **Cài đặt Ollama:**

```bash
# Windows (PowerShell)
winget install Ollama.Ollama

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

#### **Download Models:**

```bash
# Llama 2 (7B) - Recommended
ollama pull llama2

# Mistral (7B) - Faster
ollama pull mistral

# CodeLlama (7B) - Good for coding
ollama pull codellama
```

#### **Cấu hình:**

```env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

---

### **🆓 3. HUGGING FACE (Miễn phí)**

- **Chi phí**: Miễn phí (có giới hạn)
- **Ưu điểm**: Nhiều models, API đơn giản
- **Setup**: Đăng ký + lấy API key

#### **Cách lấy API Key:**

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

#### **Models miễn phí:**

- `microsoft/DialoGPT-medium` - Chat
- `gpt2` - Text generation
- `facebook/blenderbot-400M-distill` - Conversational

---

### **💰 4. GOOGLE GEMINI (Rất rẻ)**

- **Chi phí**: $0.0005/1K tokens (rẻ nhất)
- **Ưu điểm**: Google backing, multimodal
- **Setup**: Google AI Studio

#### **Cách lấy API Key:**

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập Google account
3. Tạo API key mới

#### **Cấu hình:**

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
```

#### **Cài đặt package:**

```bash
npm install @google/generative-ai
```

---

### **💰 5. ANTHROPIC CLAUDE (Rẻ hơn OpenAI)**

- **Chi phí**: $0.008/1K tokens
- **Ưu điểm**: Tốt cho reasoning, coding
- **Setup**: Anthropic Console

#### **Cách lấy API Key:**

1. Truy cập: https://console.anthropic.com/
2. Đăng ký tài khoản
3. Vào **API Keys** → **Create Key**

#### **Cấu hình:**

```env
AI_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-your-key-here
```

#### **Cài đặt package:**

```bash
npm install @anthropic-ai/sdk
```

---

### **💰 6. OPENAI (Đắt nhất)**

- **Chi phí**: $0.002/1K tokens
- **Ưu điểm**: Chất lượng cao, ổn định
- **Setup**: OpenAI Platform

#### **Cách lấy API Key:**

1. Truy cập: https://platform.openai.com/
2. Đăng ký tài khoản
3. Vào **API Keys** → **Create new secret key**

#### **Cấu hình:**

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
```

---

## 🚀 **QUICK SETUP**

### **Option 1: Fallback (Ngay lập tức)**

```env
AI_PROVIDER=fallback
```

### **Option 2: Ollama (5 phút)**

```bash
# 1. Cài đặt Ollama
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

### **Option 4: Gemini (1 phút)**

```bash
# 1. Đăng ký tại https://makersuite.google.com/
# 2. Lấy API key
# 3. Cài đặt package
npm install @google/generative-ai

# 4. Cấu hình
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key
```

---

## 📊 **SO SÁNH CHI PHÍ**

| Provider         | Chi phí/1K tokens | Free Tier       | Setup Time |
| ---------------- | ----------------- | --------------- | ---------- |
| **Fallback**     | $0                | Unlimited       | 0 phút     |
| **Ollama**       | $0                | Unlimited       | 5 phút     |
| **Hugging Face** | $0                | 1K requests/day | 2 phút     |
| **Gemini**       | $0.0005           | $5 credit       | 1 phút     |
| **Claude**       | $0.008            | $5 credit       | 1 phút     |
| **OpenAI**       | $0.002            | $5 credit       | 1 phút     |

---

## 🎯 **KHUYẾN NGHỊ**

### **Cho Development:**

1. **Fallback** - Test nhanh
2. **Ollama** - Local development
3. **Hugging Face** - Free API testing

### **Cho Production:**

1. **Gemini** - Rẻ nhất, chất lượng tốt
2. **Claude** - Tốt cho reasoning
3. **OpenAI** - Chất lượng cao nhất

### **Cho Demo/Portfolio:**

1. **Fallback** - Không cần setup
2. **Ollama** - Showcase local AI
3. **Gemini** - Professional với chi phí thấp

---

## 🔧 **TESTING**

```bash
# Test AI provider
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
```

### **Hugging Face rate limit:**

- Đợi 1 giờ hoặc upgrade account
- Sử dụng model khác

### **API key không hoạt động:**

- Kiểm tra key có đúng không
- Kiểm tra billing/quota
- Thử provider khác

---

**💡 Tip: Bắt đầu với Fallback, sau đó upgrade lên Ollama hoặc Gemini khi cần!**
