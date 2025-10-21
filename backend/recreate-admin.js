const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import User model
const User = require('./src/models/User');

const recreateAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'admin@vha-atelier.com' });
    console.log('🗑️ Deleted existing admin user');

    // Create new admin user
    const adminData = {
      name: 'VHA Admin',
      email: 'admin@vha-atelier.com',
      password: 'admin123456',
      phone: '0123456789',
      role: 'admin',
      isActive: true,
      emailVerified: true
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = await User.create(adminData);

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('👤 Role:', admin.role);
    console.log('✅ Active:', admin.isActive);
    console.log('🔑 Password hash exists:', !!admin.password);

    // Test password comparison
    const testPassword = 'admin123456';
    const isPasswordValid = await admin.comparePassword(testPassword);
    console.log('🔑 Password comparison test:', isPasswordValid);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
recreateAdmin();


