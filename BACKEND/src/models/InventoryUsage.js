const mongoose = require('mongoose');

const inventoryUsageSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProduct', required: true },
  
  quantityUsed: { type: Number, required: true, min: 0.01 },
  purpose: { type: String, required: true }, // e.g., 'Laddu Preparation', 'Daily Pooja'
  usageDate: { type: Date, default: Date.now },
  
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Staff ID
}, { timestamps: true });

module.exports = mongoose.model('InventoryUsage', inventoryUsageSchema);
