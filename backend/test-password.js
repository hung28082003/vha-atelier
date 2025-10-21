const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import User model
const User = require('./src/models/User');

const testPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@vha-atelier.com' });
    console.log('👤 Admin found:', !!admin);
    
    if (admin) {
      console.log('📧 Email:', admin.email);
      console.log('🔑 Password hash:', admin.password);
      console.log('🔑 Password hash length:', admin.password?.length);
      
      // Test with plain password
      const plainPassword = 'admin123456';
      console.log('🔑 Testing with plain password:', plainPassword);
      
      // Test bcrypt directly
      const directTest = await bcrypt.compare(plainPassword, admin.password);
      console.log('🔑 Direct bcrypt test:', directTest);
      
      // Test with method
      const methodTest = await admin.comparePassword(plainPassword);
      console.log('🔑 Method test:', methodTest);
      
      // Test hash generation
      const newHash = await bcrypt.hash(plainPassword, 10);
      console.log('🔑 New hash generated:', !!newHash);
      console.log('🔑 New hash test:', await bcrypt.compare(plainPassword, newHash));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
testPassword();


