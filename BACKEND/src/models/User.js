const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  
  // Verification
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  
  // Lockout and Security
  status: { type: String, enum: ['active', 'inactive', 'locked'], default: 'active' },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLogin: { type: Date },
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Optional Temple linkage for multi-tenant users
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
