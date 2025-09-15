

const mongoose = require('mongoose');
const connectDB = require('../config/database');
const { createIndexes } = require('../db/utils/indexManager');
const { runSeeders } = require('../db/seeders/index');

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting LocalGoods database setup...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');
    
    // Create indexes
    console.log('📊 Creating indexes...');
    await createIndexes();
    console.log('✅ Indexes created\n');
    
    // Run seeders (but don't connect again since we're already connected)
    console.log('🌱 Running seeders...');
    
    // Import and run seeders directly without connecting again
    const { seedCategories } = require('../db/seeders/categorySeeder');
    const { createAdminUser } = require('../db/seeders/adminSeeder');
    
    await seedCategories();
    await createAdminUser();
    
    console.log('✅ Seeders completed\n');
    console.log('🎉 Database setup completed successfully!');
    console.log('\nYou can now start the application with: npm run dev');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };