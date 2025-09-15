const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  attachments: [{
    type: String,
    url: String,
    filename: String,
    size: Number
  }],
  readStatus: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  messageType: {
    type: String,
    enum: ['text', 'image', 'document'],
    default: 'text'
  }
}, {
  timestamps: true
});

messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, readStatus: 1 });

module.exports = mongoose.model('Message', messageSchema);
