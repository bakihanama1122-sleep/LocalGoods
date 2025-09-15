const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  shopDescription: {
    type: String,
    maxlength: 1000
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: true
      // Note: This should be encrypted in production
    },
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  kycDocuments: [{
    documentType: {
      type: String,
      enum: ['aadhar', 'pan', 'business_license', 'gst', 'other']
    },
    documentUrl: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  commissionRate: {
    type: Number,
    default: 0.05, // 5% default commission
    min: 0,
    max: 0.3
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellerProfile', sellerProfileSchema);
