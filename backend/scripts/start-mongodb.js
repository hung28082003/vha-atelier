#!/usr/bin/env node

/**
 * MongoDB Local Setup Script
 * This script helps you set up MongoDB locally for development
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 MongoDB Local Setup Script');
console.log('==============================');

// Check if MongoDB is installed
exec('mongod --version', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ MongoDB is not installed or not in PATH');
    console.log('💡 Please install MongoDB:');
    console.log('   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
    console.log('   macOS: brew install mongodb-community');
    console.log('   Ubuntu: sudo apt-get install mongodb');
    return;
  }

  console.log('✅ MongoDB is installed');
  console.log(stdout);

  // Check if MongoDB is running
  exec('netstat -an | findstr :27017', (error, stdout, stderr) => {
    if (stdout.includes('27017')) {
      console.log('✅ MongoDB is already running on port 27017');
    } else {
      console.log('⚠️ MongoDB is not running');
      console.log('💡 To start MongoDB:');
      console.log('   Windows: net start MongoDB');
      console.log('   macOS/Linux: brew services start mongodb-community');
      console.log('   Or run: mongod --dbpath /path/to/your/db');
    }
  });
});

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data/db');
const fs = require('fs');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Created data directory: ${dataDir}`);
}
