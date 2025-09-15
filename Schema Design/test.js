// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('Testing direct connection...');
mongoose.connect(uri)
  .then(() => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Connection failed:', error.message);
    process.exit(1);
  });
