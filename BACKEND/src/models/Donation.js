const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  donorName: { type: String, required: true },
  donorPhone: { type: String },
  donorEmail: { type: String },
  
  amount: { type: Number, required: true, min: 1 },
  donationCategory: { 
    type: String, 
    enum: ['General Donation', 'Annadanam', 'Temple Development', 'Festival Contribution'], 
    required: true 
  },
  
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'Bank Transfer'], required: true },
  transactionId: { type: String }, // For online payments
  
  receiptIssued: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
