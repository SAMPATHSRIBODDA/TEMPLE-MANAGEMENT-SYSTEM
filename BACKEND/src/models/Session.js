const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  deviceInfo: {
    ip: String,
    userAgent: String
  },
  expiresAt: { type: Date, required: true },
  isValid: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-delete expired sessions using TTL index
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
