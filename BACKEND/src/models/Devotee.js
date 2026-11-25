const mongoose = require('mongoose');

const devoteeSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true },
  gotra: { type: String, trim: true },
  dob: { type: Date },
  anniversary: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  familyMembers: [{
    name: String,
    relation: String,
    dob: Date
  }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// Compound index for quick lookup by phone within a specific temple
devoteeSchema.index({ templeId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('Devotee', devoteeSchema);
