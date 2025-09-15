const mongoose = require('mongoose');

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    console.log('🔧 Creating database indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ phone: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    console.log('✅ Users indexes created');
    
    // SellerProfiles collection indexes
    await db.collection('sellerprofiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('sellerprofiles').createIndex({ verified: 1 });
    await db.collection('sellerprofiles').createIndex({ 'rating.average': -1 });
    await db.collection('sellerprofiles').createIndex({ shopName: 1 });
    console.log('✅ SellerProfiles indexes created');
    
    // Categories collection indexes
    await db.collection('categories').createIndex({ parentId: 1 });
    await db.collection('categories').createIndex({ name: 1 });
    await db.collection('categories').createIndex({ isActive: 1 });
    console.log('✅ Categories indexes created');
    
    // Products collection indexes
    await db.collection('products').createIndex({ sellerId: 1, status: 1 });
    await db.collection('products').createIndex({ categoryId: 1, status: 1 });
    await db.collection('products').createIndex({ 
      title: 'text', 
      description: 'text', 
      tags: 'text' 
    });
    await db.collection('products').createIndex({ 'location.city': 1, 'location.state': 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ condition: 1 });
    await db.collection('products').createIndex({ status: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ views: -1 });
    await db.collection('products').createIndex({ 'rating.average': -1 });
    console.log('✅ Products indexes created');
    
    // Orders collection indexes
    await db.collection('orders').createIndex({ buyerId: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ 'orderItems.sellerId': 1, createdAt: -1 });
    await db.collection('orders').createIndex({ orderStatus: 1 });
    await db.collection('orders').createIndex({ paymentStatus: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    console.log('✅ Orders indexes created');
    
    // Payments collection indexes
    await db.collection('payments').createIndex({ orderId: 1 });
    await db.collection('payments').createIndex({ gatewayTxId: 1 }, { unique: true });
    await db.collection('payments').createIndex({ status: 1 });
    await db.collection('payments').createIndex({ createdAt: -1 });
    console.log('✅ Payments indexes created');
    
    // Reviews collection indexes
    await db.collection('reviews').createIndex(
      { productId: 1, buyerId: 1, orderId: 1 }, 
      { unique: true }
    );
    await db.collection('reviews').createIndex({ productId: 1, moderationStatus: 1 });
    await db.collection('reviews').createIndex({ rating: 1 });
    await db.collection('reviews').createIndex({ createdAt: -1 });
    console.log('✅ Reviews indexes created');
    
    // Messages collection indexes
    await db.collection('messages').createIndex({ fromUserId: 1, toUserId: 1, createdAt: -1 });
    await db.collection('messages').createIndex({ toUserId: 1, readStatus: 1 });
    await db.collection('messages').createIndex({ createdAt: -1 });
    console.log('✅ Messages indexes created');
    
    // Payouts collection indexes
    await db.collection('payouts').createIndex({ sellerId: 1, payoutDate: -1 });
    await db.collection('payouts').createIndex({ status: 1 });
    await db.collection('payouts').createIndex({ payoutDate: -1 });
    console.log('✅ Payouts indexes created');
    
    console.log('🎉 All indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
};

const dropAllIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = ['users', 'sellerprofiles', 'categories', 'products', 'orders', 'payments', 'reviews', 'messages', 'payouts'];
    
    console.log('🗑️ Dropping all indexes...');
    
    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).dropIndexes();
        console.log(`✅ Dropped indexes for ${collectionName}`);
      } catch (error) {
        if (error.codeName === 'NamespaceNotFound') {
          console.log(`⚠️ Collection ${collectionName} does not exist, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('🎉 All indexes dropped successfully!');
    
  } catch (error) {
    console.error('❌ Error dropping indexes:', error);
    throw error;
  }
};

const listAllIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Current indexes:');
    
    for (const collection of collections) {
      const indexes = await db.collection(collection.name).indexes();
      console.log(`\n🗂️ ${collection.name.toUpperCase()}:`);
      indexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${index.name} - ${JSON.stringify(index.key)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error listing indexes:', error);
    throw error;
  }
};

module.exports = {
  createIndexes,
  dropAllIndexes,
  listAllIndexes
};
