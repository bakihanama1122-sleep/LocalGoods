const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  commissionAmount: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  payoutDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: String,
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  payoutMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'wallet'],
    default: 'bank_transfer'
  },
  failureReason: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

payoutSchema.index({ sellerId: 1, payoutDate: -1 });
payoutSchema.index({ status: 1 });

module.exports = mongoose.model('Payout', payoutSchema);