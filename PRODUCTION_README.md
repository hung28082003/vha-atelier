# VHA Atelier - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail App Password

### 1. Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd vha-atelier

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Environment Variables

Create `backend/config.env`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Configuration
AI_PROVIDER=fallback
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_huggingface_key

# Frontend URL
FRONTEND_URL=https://your-domain.com
```

### 3. Database Setup

```bash
# Seed initial data
cd backend
node src/scripts/seedData.js
```

### 4. Start Application

```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 Admin Access

**Default Admin Credentials:**

- Email: `admin@vha-atelier.com`
- Password: `admin123456`

**Important:** Change admin password in production!

## 📊 Features

### Frontend (React.js)

- ✅ Responsive Design
- ✅ User Authentication
- ✅ Product Catalog
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ User Dashboard
- ✅ Admin Panel
- ✅ AI Chatbot
- ✅ Order Management

### Backend (Node.js)

- ✅ RESTful API
- ✅ JWT Authentication
- ✅ ✅ MongoDB Integration
- ✅ File Upload (Cloudinary)
- ✅ Email Service
- ✅ AI Integration
- ✅ Admin Management
- ✅ Error Handling
- ✅ Security Headers

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `GET /api/products/featured` - Featured products

### Admin

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/products` - Product management
- `GET /api/admin/orders` - Order management

### Documentation

- `GET /api/docs` - API documentation

## 🛡️ Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Input Validation
- SQL Injection Prevention
- XSS Protection

## 📱 Mobile Responsive

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

```bash
# Frontend to Vercel
cd frontend
vercel --prod

# Backend to Railway
cd backend
railway login
railway deploy
```

### Option 2: Netlify (Frontend) + Heroku (Backend)

```bash
# Frontend to Netlify
cd frontend
npm run build
# Upload dist folder to Netlify

# Backend to Heroku
cd backend
heroku create your-app-name
git push heroku main
```

### Option 3: Docker Deployment

```bash
# Build and run with Docker
docker-compose up -d
```

## 📈 Performance Optimization

- Image optimization with Cloudinary
- Lazy loading components
- Code splitting
- Caching strategies
- Database indexing
- CDN integration

## 🔍 Monitoring

- Error tracking with Error Boundary
- Performance monitoring
- Database monitoring
- User analytics

## 📞 Support

For technical support:

- Email: support@vha-atelier.com
- Documentation: `/api/docs`
- GitHub Issues: [Repository Issues]

## 📄 License

This project is licensed under the MIT License.

---

**VHA Atelier** - Thời trang cao cấp cho mọi người 🎨

