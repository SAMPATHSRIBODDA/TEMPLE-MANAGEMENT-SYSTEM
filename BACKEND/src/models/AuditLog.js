const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null if action by unauthenticated user
  action: { type: String, required: true }, // e.g., 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'PASSWORD_RESET'
  resource: { type: String }, // e.g., 'User', 'Ticket'
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object }, // Arbitrary JSON for changes
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
