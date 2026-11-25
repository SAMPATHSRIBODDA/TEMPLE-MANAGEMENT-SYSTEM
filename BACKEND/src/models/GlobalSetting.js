const mongoose = require('mongoose');

const globalSettingSchema = new mongoose.Schema({
  type: { type: String, enum: ['STRIPE', 'RAZORPAY', 'TWILIO', 'MSG91'], required: true, unique: true },
  keys: {
    publicKey: { type: String },
    secretKey: { type: String }
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('GlobalSetting', globalSettingSchema);
