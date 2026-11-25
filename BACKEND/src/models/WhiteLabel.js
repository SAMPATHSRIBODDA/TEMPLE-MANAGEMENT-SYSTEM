const mongoose = require('mongoose');

const whiteLabelSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true, unique: true },
  appName: { type: String, required: true, default: 'Temple Admin' },
  primaryColor: { type: String, default: '#5B4BDB' },
  secondaryColor: { type: String, default: '#F59E0B' },
  logoUrl: { type: String, default: '' },
  splashScreenUrl: { type: String, default: '' },
  notificationSms: { 
    type: String, 
    default: 'Dear {devoteeName}, your donation of {amount} to {templeName} is received. Receipt: {receiptUrl}' 
  }
}, { timestamps: true });

module.exports = mongoose.model('WhiteLabel', whiteLabelSchema);
