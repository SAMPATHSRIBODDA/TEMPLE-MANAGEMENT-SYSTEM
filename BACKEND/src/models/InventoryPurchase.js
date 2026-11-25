const mongoose = require('mongoose');

const inventoryPurchaseSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryVendor', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProduct', required: true },
  
  quantity: { type: Number, required: true, min: 0.01 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  
  invoiceNumber: { type: String },
  purchaseDate: { type: Date, default: Date.now },
  
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Staff ID
}, { timestamps: true });

module.exports = mongoose.model('InventoryPurchase', inventoryPurchaseSchema);
