const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import User model
const User = require('./src/models/User');

const debugAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@vha-atelier.com' });
    console.log('👤 Admin found:', !!admin);
    
    if (admin) {
      console.log('📧 Email:', admin.email);
      console.log('👤 Role:', admin.role);
      console.log('✅ Is Active:', admin.isActive);
      console.log('🔑 Password exists:', !!admin.password);
      
      // Test password comparison
      const testPassword = 'admin123456';
      const isPasswordValid = await admin.comparePassword(testPassword);
      console.log('🔑 Password valid:', isPasswordValid);
      
      // Test with bcrypt directly
      const directComparison = await bcrypt.compare(testPassword, admin.password);
      console.log('🔑 Direct bcrypt comparison:', directComparison);
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
debugAdmin();


