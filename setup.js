#!/usr/bin/env node

/**
 * VHA Atelier Setup Script
 * Hướng dẫn cấu hình dự án
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 VHA Atelier Setup Script');
console.log('============================');

const questions = [
  {
    key: 'MONGODB_URI',
    question: 'MongoDB URI (mongodb://localhost:27017/vha-atelier hoặc Atlas URI): ',
    default: 'mongodb://localhost:27017/vha-atelier'
  },
  {
    key: 'JWT_SECRET',
    question: 'JWT Secret (random string): ',
    default: 'vha-atelier-super-secret-jwt-key-2024'
  },
  {
    key: 'OPENAI_API_KEY',
    question: 'OpenAI API Key (optional, để trống nếu không có): ',
    default: 'your-openai-api-key-here'
  },
  {
    key: 'EMAIL_USER',
    question: 'Email (optional, để trống nếu không có): ',
    default: 'your-email@gmail.com'
  },
  {
    key: 'EMAIL_PASS',
    question: 'Email App Password (optional, để trống nếu không có): ',
    default: 'your-app-password'
  }
];

let config = {};

const askQuestion = (index) => {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    config[q.key] = answer.trim() || q.default;
    askQuestion(index + 1);
  });
};

const generateConfig = () => {
  const configContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=${config.MONGODB_URI}

# JWT Configuration
JWT_SECRET=${config.JWT_SECRET}
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=${config.JWT_SECRET}-refresh

# OpenAI Configuration (Optional - for chatbot)
OPENAI_API_KEY=${config.OPENAI_API_KEY}

# Email Configuration (Optional - for notifications)
EMAIL_USER=${config.EMAIL_USER}
EMAIL_PASS=${config.EMAIL_PASS}
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
`;

  fs.writeFileSync('backend/config.env', configContent);
  console.log('\n✅ Config file created: backend/config.env');
  console.log('\n🚀 Next steps:');
  console.log('1. npm install');
  console.log('2. npm run dev');
  
  rl.close();
};

console.log('\n📋 Please provide the following information:');
askQuestion(0);
