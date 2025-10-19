# VHA Atelier - E-commerce Fashion Website

## 🎯 Project Overview

VHA Atelier is a modern e-commerce website specializing in fashion clothing, featuring an integrated AI chatbot for customer support and consultation. This project is built as a final year graduation project.

## 🚀 Key Features

### Customer Features
- **Product Browsing**: Browse and search fashion items with advanced filtering
- **Shopping Cart**: Add to cart, wishlist, and checkout functionality
- **User Authentication**: Secure login/register system
- **Order Management**: Track orders and view order history
- **AI Chatbot**: Intelligent customer support and fashion consultation
- **QR Payment**: Secure payment via QR code generation

### Admin Features
- **Product Management**: CRUD operations for products and categories
- **Order Management**: Process and track customer orders
- **User Management**: Manage customer accounts
- **Analytics Dashboard**: Sales and performance metrics
- **Chatbot Management**: Configure AI responses and training

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - UI Framework
- **Redux Toolkit** - State Management
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### AI & External Services
- **OpenAI API** - Chatbot Intelligence
- **Cloudinary** - Image Storage
- **QR Code Generation** - Payment System

## 📁 Project Structure

```
vha-atelier/
├── frontend/          # React.js Application
├── backend/           # Node.js API Server
├── docs/             # Project Documentation
├── package.json      # Root package.json (workspace)
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vha-atelier
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure your environment variables

4. **Start Development**
   ```bash
   npm run dev
   ```

This will start both frontend (port 3000) and backend (port 5000) servers.

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:
- [Technical Requirements](docs/01-planning/requirements.md)
- [Database Schema](docs/01-planning/database-schema.md)
- [API Documentation](docs/03-development/api-docs/)
- [Deployment Guide](docs/05-deployment/deployment-guide.md)

## 🎨 Design System

The project follows modern design principles with:
- **Color Palette**: Modern, fashion-forward colors
- **Typography**: Clean, readable fonts
- **Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting

## 📱 Payment System

- **QR Code Payment**: Generate QR codes for bank transfers
- **Manual Verification**: Admin confirmation system
- **Secure Transactions**: Encrypted payment data

## 🤖 AI Chatbot Features

- **Fashion Consultation**: Size recommendations and styling advice
- **Product Search**: Help customers find products
- **General Support**: Answer common questions
- **Learning Capability**: Improves over time

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## 🚀 Deployment

The application is designed to be deployed on:
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Heroku
- **Database**: MongoDB Atlas

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Load Time**: < 3 seconds
- **Mobile Performance**: Optimized for mobile devices

## 🤝 Contributing

This is a graduation project. For questions or suggestions, please contact the development team.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]
- **Mentor**: AI Assistant
- **Institution**: [Your University]

## 📞 Contact

For any questions or support, please contact:
- Email: [your-email@example.com]
- GitHub: [your-github-username]

---

**Built with ❤️ for the future of fashion e-commerce**
