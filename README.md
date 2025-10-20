# VHA Atelier - E-commerce Fashion Website

## 🎯 **Project Overview**

VHA Atelier is a modern e-commerce fashion website built with React.js and Node.js, featuring an AI-powered chatbot for customer support. This project was developed as a graduation project with a focus on clean code, modern UI/UX, and comprehensive functionality.

## ✨ **Key Features**

### **Frontend Features**
- 🛍️ **Product Catalog** - Browse and search fashion items
- 🛒 **Shopping Cart** - Add, update, and manage cart items
- 💳 **QR Code Payment** - Secure payment with QR code generation
- 🤖 **AI Chatbot** - Intelligent customer support powered by Ollama/Hugging Face
- 👤 **User Authentication** - Login, registration, and profile management
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI/UX** - Earth tone minimalist design with advanced animations

### **Backend Features**
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📊 **MongoDB Database** - Scalable NoSQL database with Mongoose ODM
- 🖼️ **Image Upload** - Cloudinary integration for product images
- 📧 **Email Service** - Nodemailer for transactional emails
- 🔍 **Product Search** - Advanced filtering and search capabilities
- 📈 **Order Management** - Complete order processing and tracking
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation

## 🛠️ **Technology Stack**

### **Frontend**
- **React.js 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Advanced animations and transitions

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email service
- **Ollama/Hugging Face** - AI chatbot integration (FREE)

### **Development Tools**
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple commands simultaneously
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vha-atelier.git
   cd vha-atelier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp backend/config.env.example backend/config.env
   
   # Edit backend/config.env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

### **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/health

## 📁 **Project Structure**

```
vha-atelier/
├── frontend/                 # React.js frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database and service configs
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   └── utils/          # Utility functions
│   └── package.json
├── docs/                   # Documentation
├── .gitignore
├── package.json           # Root package.json
└── README.md
```

## 🔧 **Configuration**

### **Environment Variables**

Create `backend/config.env` with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vha-atelier

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# AI Provider Configuration
AI_PROVIDER=fallback  # fallback, ollama, huggingface

# Ollama Configuration (Local AI - FREE)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Hugging Face Configuration (FREE)
HUGGINGFACE_API_KEY=your-huggingface-api-key
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🎨 **Design System**

### **Color Palette (Earth Tone)**
- **Primary**: Warm Terracotta (#D2691E)
- **Secondary**: Earth Brown (#8B4513)
- **Accent**: Warm Rust (#B7410E)
- **Neutral**: Sage Green (#9CAF88)
- **Background**: Cream (#F5F5DC)

### **Typography**
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable font
- **UI Elements**: Consistent sizing and spacing

## 📱 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### **Products**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/sale` - Get sale products

### **Categories**
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### **Cart**
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### **Orders**
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### **Chatbot**
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/conversations` - Get user conversations

## 🧪 **Testing**

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test

# Run all tests
npm run test
```

## 🚀 **Deployment**

### **Frontend (Vercel/Netlify)**
```bash
# Build for production
cd frontend && npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### **Backend (Heroku/Railway)**
```bash
# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**VHA Atelier Team**
- Email: contact@vha-atelier.com
- GitHub: [@vha-atelier](https://github.com/vha-atelier)

## 🙏 **Acknowledgments**

- OpenAI for the AI chatbot integration
- MongoDB for the database solution
- React and Node.js communities for excellent documentation
- Tailwind CSS for the utility-first CSS framework

---

**Built with ❤️ for the fashion e-commerce industry**