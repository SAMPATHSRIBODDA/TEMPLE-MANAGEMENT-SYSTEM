const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Super Admin', 'Temple Admin', 'Counter Staff', 'Accountant', 'Devotee'],
    trim: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
