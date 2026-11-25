const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  profileImage: { type: String }, // URL
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  timings: [{
    id: String,
    name: String,
    startTime: String,
    endTime: String,
    type: { type: String },
    isActive: { type: Boolean, default: true }
  }],
  festivals: [{
    id: String,
    name: String,
    date: String,
    duration: String,
    type: { type: String },
    location: String,
    expectedCrowd: String,
    description: String
  }],
  settings: {
    receiptPrefix: { type: String, default: 'RCT' },
    ticketPrefix: { type: String, default: 'TKT' },
    currency: { type: String, default: 'INR' },
    taxRate: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
