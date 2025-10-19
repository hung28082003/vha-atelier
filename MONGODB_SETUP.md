# MongoDB Setup Guide

## 🚀 Quick Setup Options

### Option 1: MongoDB Local (Recommended for Development)

#### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

#### macOS:
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Ubuntu/Linux:
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `backend/config.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/vha-atelier?retryWrites=true&w=majority
   ```

### Option 3: Docker (Alternative)

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use docker-compose
docker-compose up -d
```

## 🔧 Configuration

### Update config.env:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/vha-atelier

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/vha-atelier?retryWrites=true&w=majority
```

## 🧪 Test Connection

```bash
# Test MongoDB connection
cd backend
node -e "require('dotenv').config({path: './config.env'}); console.log('MongoDB URI:', process.env.MONGODB_URI)"
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port 27017 already in use:**
   ```bash
   # Find process using port 27017
   netstat -ano | findstr :27017
   # Kill the process
   taskkill /PID <PID> /F
   ```

2. **MongoDB service not starting:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Connection refused:**
   - Check if MongoDB is running
   - Verify the connection string
   - Check firewall settings

## 📊 Database Structure

The application will automatically create these collections:
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `carts` - Shopping carts
- `reviews` - Product reviews
- `chatbot_conversations` - AI chatbot data

## 🔄 Reset Database

```bash
# Connect to MongoDB
mongo vha-atelier

# Drop all collections
db.dropDatabase()
```

## 📝 Environment Variables

Make sure these are set in `backend/config.env`:

```env
MONGODB_URI=mongodb://localhost:27017/vha-atelier
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```
