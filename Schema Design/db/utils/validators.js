const mongoose = require('mongoose');

// Custom validators
const emailValidator = {
  validator: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  message: 'Please provide a valid email address'
};

const phoneValidator = {
  validator: function(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  },
  message: 'Please provide a valid phone number'
};

const priceValidator = {
  validator: function(price) {
    return price >= 0 && Number.isFinite(price);
  },
  message: 'Price must be a positive number'
};

const stockValidator = {
  validator: function(stock) {
    return Number.isInteger(stock) && stock >= 0;
  },
  message: 'Stock must be a non-negative integer'
};

const pincodeValidator = {
  validator: function(pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  },
  message: 'Please provide a valid Indian pincode'
};

// Database validation helpers
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const sanitizeString = (str, maxLength = 1000) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

const validateImageUrl = (url) => {
  const imageUrlRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageUrlRegex.test(url);
};

const validateProductCondition = (condition) => {
  const validConditions = ['new', 'like_new', 'good', 'fair', 'vintage', 'antique'];
  return validConditions.includes(condition);
};

module.exports = {
  emailValidator,
  phoneValidator,
  priceValidator,
  stockValidator,
  pincodeValidator,
  validateObjectId,
  sanitizeString,
  validateImageUrl,
  validateProductCondition
};
