const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      index: true
    },
    customerId: {
      type: String,
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    date: {
      type: String,
      required: true
    },
    product: {
      type: String,
      default: 'General Order'
    },
    category: {
      type: String,
      default: 'General'
    },
    paymentMethod: {
      type: String,
      default: 'UPI'
    },
    status: {
      type: String,
      default: 'Completed'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, customerId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

