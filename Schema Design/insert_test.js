// insert_test.js

const mongoose = require('mongoose');

// 1. Import your database connection function and the Product model
const connectDB = require('./config/database');
const Product = require('./models/Product'); 

// We need to wrap the logic in an async function to use 'await'
const insertProduct = async () => {
  try {
    // 2. Connect to the database first
    await connectDB();
    console.log('MongoDB connected for script...');

    // 3. Create a new product instance with fields that MATCH YOUR SCHEMA
    // NOTE: You must use real ObjectId values for sellerId and categoryId from your DB.
    const newProduct = new Product({
      sellerId: '6324a3b4c5d6e7f8a9b0c1d2', // Replace with a REAL seller's user ID from your 'users' collection
      title: 'Handcrafted Wooden Elephant',
      description: 'A beautiful, hand-carved wooden elephant statue, perfect for home decor.',
      categoryId: '6324a3b4c5d6e7f8a9b0c1d3', // Replace with a REAL category ID from your 'categories' collection
      price: 2500,
      stock: 15,
      condition: 'new',
      status: 'active',
      location: {
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302001'
      }
    });

    // 4. Save the new product to the database
    const savedProduct = await newProduct.save();
    console.log('Product created successfully!', savedProduct);

  } catch (error) {
    console.error('Error creating product:', error);
  } finally {
    // 5. Always close the connection when the script is done
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the function
insertProduct();