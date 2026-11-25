const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number },
  features: [{ type: String }],
  maxLicenses: { type: String, default: 'Unlimited' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
