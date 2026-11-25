const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // For Razorpay online payments (optional for cash)
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Cash', 'UPI', 'Card', 'Bank Transfer'], default: 'Cash' },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], default: 'created' },
  
  // Reference to what was purchased
  referenceModel: { type: String, enum: ['Ticket', 'LadduOrder', 'Pooja', 'MonthlyPooja', 'Donation'] },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  
  // Refund tracking
  refundId: { type: String },
  refundAmount: { type: Number },
  refundStatus: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
