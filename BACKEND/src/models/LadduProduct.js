const mongoose = require('mongoose');

const ladduProductSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
  name: { type: String, required: true, trim: true },
  weight: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0, min: 0 },        // alias used in seed
  currentStock: { type: Number, default: 0, min: 0 }, // alias used in controller
  status: { type: String, enum: ['available', 'out_of_stock', 'discontinued'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('LadduProduct', ladduProductSchema);
