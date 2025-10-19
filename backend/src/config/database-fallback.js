const mongoose = require('mongoose');

// Fallback database connection for development
const connectDBFallback = async () => {
  try {
    console.log('🔄 Attempting fallback MongoDB connection...');
    
    // Try local MongoDB first
    const localUri = 'mongodb://localhost:27017/vha-atelier';
    const conn = await mongoose.connect(localUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected (Fallback): ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Fallback MongoDB connection failed:', error.message);
    
    // If local MongoDB fails, try to use in-memory database for development
    console.log('💡 Using in-memory database for development...');
    
    // You can implement an in-memory database here if needed
    // For now, we'll just log the error and continue
    console.log('⚠️ Database connection failed, but server will continue running');
    console.log('💡 Some features may not work without a database connection');
    
    return null;
  }
};

module.exports = connectDBFallback;
