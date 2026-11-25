const mongoose = require('mongoose');

const ladduOrderSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'LadduProduct', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  
  orderType: { type: String, enum: ['Counter', 'Online'], required: true },
  status: { type: String, enum: ['pending_collection', 'collected', 'cancelled'], default: 'collected' },
  
  // For online orders requiring physical pickup
  pickupToken: { type: String }, 
  
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Counter staff if Counter order
  issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Devotee if Online order
}, { timestamps: true });

module.exports = mongoose.model('LadduOrder', ladduOrderSchema);
