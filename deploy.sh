#!/bin/bash

# VHA Atelier Deployment Script
echo "🚀 Starting VHA Atelier deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo "🏗️ Building backend..."
cd backend
npm install
cd ..

# Run database migrations/seeding
echo "🌱 Seeding database..."
cd backend
node src/scripts/seedData.js
cd ..

# Start production server
echo "🚀 Starting production server..."
cd backend
npm start

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📚 API Docs: http://localhost:5000/api/docs"
