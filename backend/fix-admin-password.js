const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import User model
const User = require('./src/models/User');

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@vha-atelier.com' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('👤 Admin found:', admin.email);
    console.log('👤 Role:', admin.role);
    console.log('✅ Is Active:', admin.isActive);

    // Hash new password
    const newPassword = 'admin123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password directly
    await User.updateOne(
      { email: 'admin@vha-atelier.com' },
      { 
        password: hashedPassword,
        isActive: true,
        role: 'admin'
      }
    );

    console.log('🎉 Admin password updated successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', newPassword);
    console.log('👤 Role: admin');
    console.log('✅ Active: true');

    // Verify the update
    const updatedAdmin = await User.findOne({ email: 'admin@vha-atelier.com' }).select('+password');
    if (updatedAdmin) {
      const passwordTest = await bcrypt.compare(newPassword, updatedAdmin.password);
      console.log('🔑 Password verification:', passwordTest);
    }

  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
fixAdminPassword();


