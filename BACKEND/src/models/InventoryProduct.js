const mongoose = require('mongoose');

const inventoryProductSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  name: { type: String, required: true, trim: true }, // e.g., 'Rice', 'Ghee', 'Flowers'
  category: { type: String, enum: ['Raw Material', 'Consumable', 'Asset'], required: true },
  unit: { type: String, required: true }, // e.g., 'kg', 'liters', 'pieces'
  currentStock: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryProduct', inventoryProductSchema);
