const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true, unique: true },
  coreAccess: {
    mobileApp: { type: Boolean, default: false },
    desktopSoftware: { type: Boolean, default: true }
  },
  modules: {
    darshan: { type: Boolean, default: false },
    laddu: { type: Boolean, default: false },
    pooja: { type: Boolean, default: true },
    donation: { type: Boolean, default: true },
    inventory: { type: Boolean, default: true }
  },
  versioning: {
    currentVersion: { type: String, default: '1.0.0' },
    availableUpdate: { type: String, default: null },
    history: [{
      version: String,
      type: { type: String, enum: ['Major', 'Minor', 'Patch'] },
      date: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('AppConfig', appConfigSchema);
