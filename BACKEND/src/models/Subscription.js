const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  status: { type: String, enum: ['Active', 'Trial', 'Expired', 'Cancelled'], default: 'Active' },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  billingCycle: { type: String, enum: ['Monthly', 'Yearly'], default: 'Monthly' },
  amount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
