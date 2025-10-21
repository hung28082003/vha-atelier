const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import User model
const User = require('./src/models/User');

const resetAdminPassword = async () => {
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

    console.log('👤 Found admin user:', admin.email);
    console.log('🔑 Current role:', admin.role);

    // Reset password
    const newPassword = 'admin123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    admin.isActive = true;
    admin.role = 'admin';
    await admin.save();

    console.log('🎉 Admin password reset successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', newPassword);
    console.log('👤 Role:', admin.role);
    console.log('✅ Active:', admin.isActive);

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
resetAdminPassword();


