const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  receiptNumber: { type: String, required: true, unique: true }, // Auto-incremented e.g. RCT-0001
  
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Staff ID
  issuedToName: { type: String }, // Devotee Name (optional for quick counter sales)
  issuedToPhone: { type: String },
  
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card'], required: true },
  
  // A receipt can have multiple items (e.g. 1 Ticket, 2 Laddus)
  items: [{
    itemType: { type: String, enum: ['Ticket', 'LadduOrder', 'Pooja', 'MonthlyPooja', 'Donation'], required: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Link to the specific record
    description: String,
    categoryName: String, // Dynamic section name (e.g., Laddu, Pooja, or dynamic ticket section)
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  
  isReprinted: { type: Boolean, default: false },
  status: { type: String, enum: ['valid', 'cancelled'], default: 'valid' }
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);
