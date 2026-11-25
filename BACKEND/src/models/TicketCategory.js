const mongoose = require('mongoose');

const ticketCategorySchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sectionName: { type: String, required: true }, // e.g., 'Entry Tickets', 'Laddu Types', 'Special Darshan'
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TicketCategory', ticketCategorySchema);
