const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../../config.env') });

const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔄 Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Áo sơ mi',
        description: 'Áo sơ mi nam nữ cao cấp',
        slug: 'ao-so-mi',
        isActive: true
      },
      {
        name: 'Váy',
        description: 'Váy dài, váy ngắn thời trang',
        slug: 'vay',
        isActive: true
      },
      {
        name: 'Quần',
        description: 'Quần jean, quần tây, quần short',
        slug: 'quan',
        isActive: true
      },
      {
        name: 'Phụ kiện',
        description: 'Túi xách, giày dép, đồng hồ',
        slug: 'phu-kien',
        isActive: true
      }
    ]);
    console.log('✅ Created categories');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const adminUser = await User.create({
      name: 'Admin VHA Atelier',
      email: 'admin@vha-atelier.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true
    });
    console.log('✅ Created admin user');

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Nguyễn Văn A',
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true,
        isEmailVerified: true
      },
      {
        name: 'Trần Thị B',
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true,
        isEmailVerified: true
      }
    ]);
    console.log('✅ Created sample users');

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Áo sơ mi nam cao cấp',
        slug: 'ao-so-mi-nam-cao-cap',
        description: 'Áo sơ mi nam chất liệu cotton cao cấp, form dáng chuẩn',
        price: 500000,
        originalPrice: 600000,
        stock: 50,
        category: categories[0]._id,
        brand: 'VHA Atelier',
        sizes: [
          { size: 'S', stock: 10, sku: 'ASM-S' },
          { size: 'M', stock: 15, sku: 'ASM-M' },
          { size: 'L', stock: 15, sku: 'ASM-L' },
          { size: 'XL', stock: 10, sku: 'ASM-XL' }
        ],
        colors: [
          { name: 'Trắng', hex: '#FFFFFF' },
          { name: 'Xanh', hex: '#0066CC' },
          { name: 'Đen', hex: '#000000' }
        ],
        images: [
          {
            url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/shirt1.jpg',
            alt: 'Áo sơ mi nam'
          }
        ],
        tags: ['thời trang', 'cao cấp', 'nam'],
        isActive: true,
        isFeatured: true,
        isOnSale: true
      },
      {
        name: 'Váy dài nữ sang trọng',
        slug: 'vay-dai-nu-sang-trong',
        description: 'Váy dài nữ thiết kế sang trọng, phù hợp mọi dịp',
        price: 800000,
        originalPrice: 1000000,
        stock: 30,
        category: categories[1]._id,
        brand: 'VHA Atelier',
        sizes: [
          { size: 'S', stock: 10, sku: 'VDN-S' },
          { size: 'M', stock: 10, sku: 'VDN-M' },
          { size: 'L', stock: 10, sku: 'VDN-L' }
        ],
        colors: [
          { name: 'Đen', hex: '#000000' },
          { name: 'Đỏ', hex: '#CC0000' },
          { name: 'Xanh', hex: '#0066CC' }
        ],
        images: [
          {
            url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/dress1.jpg',
            alt: 'Váy dài nữ'
          }
        ],
        tags: ['thời trang', 'nữ', 'sang trọng'],
        isActive: true,
        isFeatured: true,
        isOnSale: true
      },
      {
        name: 'Quần jean nam',
        slug: 'quan-jean-nam',
        description: 'Quần jean nam chất liệu denim cao cấp',
        price: 600000,
        stock: 40,
        category: categories[2]._id,
        brand: 'VHA Atelier',
        sizes: [
          { size: '28', stock: 10, sku: 'QJ-28' },
          { size: '30', stock: 10, sku: 'QJ-30' },
          { size: '32', stock: 10, sku: 'QJ-32' },
          { size: '34', stock: 10, sku: 'QJ-34' }
        ],
        colors: [
          { name: 'Xanh', hex: '#0066CC' },
          { name: 'Đen', hex: '#000000' }
        ],
        images: [
          {
            url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/jeans1.jpg',
            alt: 'Quần jean nam'
          }
        ],
        tags: ['jean', 'nam', 'casual'],
        isActive: true,
        isFeatured: false,
        isOnSale: false
      },
      {
        name: 'Túi xách nữ cao cấp',
        slug: 'tui-xach-nu-cao-cap',
        description: 'Túi xách nữ thiết kế tinh tế, chất liệu da thật',
        price: 1200000,
        stock: 20,
        category: categories[3]._id,
        brand: 'VHA Atelier',
        sizes: [
          { size: 'One Size', stock: 20, sku: 'TX-OS' }
        ],
        colors: [
          { name: 'Đen', hex: '#000000' },
          { name: 'Nâu', hex: '#8B4513' },
          { name: 'Đỏ', hex: '#CC0000' }
        ],
        images: [
          {
            url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/products/bag1.jpg',
            alt: 'Túi xách nữ'
          }
        ],
        tags: ['túi xách', 'nữ', 'cao cấp'],
        isActive: true,
        isFeatured: true,
        isOnSale: false
      }
    ]);
    console.log('✅ Created sample products');

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${users.length + 1} users (including admin)`);
    console.log(`   - ${products.length} products`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seedData();

