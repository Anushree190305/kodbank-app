const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdraw', 'transfer'],
  },
  amount: {
    type: Number,
    required: true,
  },
  recipient: {
    type: String,
    default: null,
  },
  recipientAccountNumber: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
    default: 'completed',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
