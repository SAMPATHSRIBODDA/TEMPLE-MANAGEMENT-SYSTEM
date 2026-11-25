const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  channel: { type: String, enum: ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'], required: true },
  type: { type: String, enum: ['TRANSACTIONAL', 'PROMOTIONAL', 'REMINDER'], required: true },
  
  recipient: { type: String, required: true }, // Email address, Phone number, or Device Token
  subject: { type: String }, // Used for emails
  content: { type: String, required: true },
  
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  providerResponse: { type: Object }, // e.g., Twilio message SID or SendGrid response
  
  sentAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
