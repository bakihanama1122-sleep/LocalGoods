const mongoose = require('mongoose');
const connectDB = require('../../config/database');  // Fixed path
const { seedCategories } = require('./categorySeeder');
const { createAdminUser } = require('./adminSeeder');

const runSeeders = async () => {
  try {
    // Don't connect again if already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    console.log('🌱 Starting database seeding...');
    
    // Run all seeders
    await seedCategories();
    await createAdminUser();
    
    console.log('✅ Database seeding completed successfully!');
    
    // Only exit if this file is run directly
    if (require.main === module) {
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders };