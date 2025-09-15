const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  condition: {
    type: String,
    enum: ['new', 'like_new', 'good', 'fair', 'vintage', 'antique'],
    required: true
  },
  provenance: {
    origin: String,
    age: String,
    authenticity: String,
    appraisal: {
      value: Number,
      appraiser: String,
      date: Date,
      certificate: String
    },
    history: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'mm'],
      default: 'cm'
    }
  },
  tags: [String],
  location: {
    city: String,
    state: String,
    pincode: String
  },
  shipping: {
    available: {
      type: Boolean,
      default: true
    },
    localPickup: {
      type: Boolean,
      default: false
    },
    meetupAvailable: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'flagged', 'sold_out'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
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
  }
}, {
  timestamps: true
});

// Indexes for search optimization
productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ 'location.city': 1, 'location.state': 1 });
productSchema.index({ price: 1 });
productSchema.index({ condition: 1 });

module.exports = mongoose.model('Product', productSchema);


