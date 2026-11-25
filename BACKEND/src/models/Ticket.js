const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  ticketNumber: { type: String, unique: true, required: true }, // Auto-generated
  ticketType: { 
    type: String, 
    required: true 
  },
  sectionName: { type: String, default: 'General' },
  price: { type: Number, required: true },
  
  // Demographics
  adultCount: { type: Number, default: 1, min: 0 },
  childCount: { type: Number, default: 0, min: 0 },
  isGroupTicket: { type: Boolean, default: false },

  // Scheduling
  validForDate: { type: Date, required: true },
  slotTime: { type: String }, // e.g., '10:00 AM - 11:00 AM'
  
  // QR and Security
  qrCode: { type: String, required: true, unique: true }, // The hashed string or raw payload
  qrImageData: { type: String }, // Base64 data URI of the QR image
  
  status: { type: String, enum: ['issued', 'used', 'cancelled', 'expired'], default: 'issued' },
  
  // Issuance Info
  issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The devotee
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The counter staff (null if online)
  usedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
