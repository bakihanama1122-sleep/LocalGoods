const User = require('../../models/User');  // Changed from '../models/User'
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@localgoods.com' 
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    const admin = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@localgoods.com',
      phone: '+919999999999',
      passwordHash: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isVerified: true,
      address: [{
        type: 'work',
        street: 'Admin Office',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India',
        isDefault: true
      }]
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;  // Re-throw error so it can be caught by the calling function
  }
};

module.exports = { createAdminUser };