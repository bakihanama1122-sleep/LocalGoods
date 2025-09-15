// find-test.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected!');
    
    const products = await Product.find();
    console.log('Products in DB:', products);

    mongoose.disconnect();
  })
  .catch(err => console.error('Error:', err));
