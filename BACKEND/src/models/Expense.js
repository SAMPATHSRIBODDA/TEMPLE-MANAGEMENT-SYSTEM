const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  vendorName: { type: String }, // Party or Vendor paid to
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque'], default: 'Cash' },
  fundedBy: { type: String, default: 'General Funds' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
