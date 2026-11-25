const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Temple = require('../models/Temple');

// @desc    Get all subscription plans
// @route   GET /api/v1/subscriptions/plans
// @access  Private (Super Admin)
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create subscription plan
// @route   POST /api/v1/subscriptions/plans
// @access  Private (Super Admin)
exports.createPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all active subscriptions
// @route   GET /api/v1/subscriptions
// @access  Private (Super Admin)
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('templeId', 'name _id')
      .populate('planId', 'name monthlyPrice yearlyPrice');
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign subscription to temple
// @route   POST /api/v1/subscriptions
// @access  Private (Super Admin)
exports.createSubscription = async (req, res) => {
  try {
    // Basic logic to assign a plan to a temple
    const subscription = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
