const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user_id: {
      type: String,
      unique: true,
      ref: 'User'
  },
  balance: {
      type: Number,
      min: [0, 'Balance cannot be negative'],
      default: 0
  }
}, {
  timestamps: true,
  collection: 'sellers'
});

module.exports = mongoose.model('Seller', sellerSchema);
