const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }, // e.g., 'manage_users', 'issue_tickets'
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
