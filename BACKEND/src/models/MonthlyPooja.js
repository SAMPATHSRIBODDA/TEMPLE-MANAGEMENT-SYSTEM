const mongoose = require('mongoose');

const monthlyPoojaSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  poojaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pooja', required: true },
  devoteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  planType: { type: String, enum: ['1 Month', '3 Months', '6 Months', '1 Year'], required: true },
  amountPaid: { type: Number, required: true },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  familyMembers: [{
    name: String,
    gotram: String,
    nakshatram: String
  }],

  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('MonthlyPooja', monthlyPoojaSchema);
