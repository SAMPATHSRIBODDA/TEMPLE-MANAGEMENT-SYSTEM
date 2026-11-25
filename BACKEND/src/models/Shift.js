const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The counter staff
  status: { type: String, enum: ['Open', 'Pending Verification', 'Verified'], default: 'Open' },
  
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  
  openingBalance: { type: Number, required: true, default: 0 },
  
  // Calculated when closing
  systemCashSales: { type: Number, default: 0 },
  systemOnlineSales: { type: Number, default: 0 },
  
  // e.g. { "Laddu Sales": { cash: 100, online: 200 }, "Poojas": { cash: 50, online: 0 } }
  categoryBreakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Entered by user
  physicalCashCounted: { type: Number, default: 0 },
  
  // difference between expected (opening + cash sales) and actual physical cash
  discrepancy: { type: Number, default: 0 },
  discrepancyReason: { type: String, default: '' },
  
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);
