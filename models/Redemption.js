const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cash', 'product'],
    required: true
  },
 pointsUsed: {
  type: Number,
  required: [true, 'Points used are required'],
  min: [1, 'Points used must be greater than 0']
},
  cashAmount: {
  type: Number,
  min: [0, 'Cash amount cannot be negative']
},
  productName: {
  type: String,
  trim: true
},
  status: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Redemption', redemptionSchema);
