const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  sourceName: { type: String }, // Party or Source received from
  date: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque'], default: 'Cash' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
