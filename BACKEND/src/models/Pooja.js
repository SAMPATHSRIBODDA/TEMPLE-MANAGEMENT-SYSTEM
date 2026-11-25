const mongoose = require('mongoose');

const poojaSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  category: { type: String, enum: ['Daily', 'Weekly', 'Festival', 'Personal'], required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String }, // NEW
  price: { type: Number, required: true },
  
  // NEW: Monthly/Subscription Support
  isMonthly: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },

  schedule: {
    days: [{ type: String }], // 'Monday', 'Tuesday'
    timeSlot: String
  },
  
  priestAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // For personal bookings
  devoteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sankalpamNames: [{ type: String }], // Gotra and Names
  bookingDate: { type: Date },
  
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Pooja', poojaSchema);
