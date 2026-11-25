const GlobalSetting = require('../models/GlobalSetting');

// @desc    Get all global settings
// @route   GET /api/v1/system/settings
// @access  Private (Super Admin)
exports.getSettings = async (req, res) => {
  try {
    const settings = await GlobalSetting.find();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update or create a global setting
// @route   PUT /api/v1/system/settings/:type
// @access  Private (Super Admin)
exports.updateSetting = async (req, res) => {
  try {
    const type = req.params.type;
    const setting = await GlobalSetting.findOneAndUpdate(
      { type },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get system backups (Mock implementation)
// @route   GET /api/v1/system/backups
// @access  Private (Super Admin)
exports.getBackups = async (req, res) => {
  try {
    // Return mock data for backups since true DB backup is usually handled at infrastructure level
    const backups = [
      { id: 'BKP-2023-11-20', date: new Date().toISOString(), size: '2.4 GB', type: 'Full Database', status: 'Completed' },
      { id: 'BKP-2023-11-19', date: new Date(Date.now() - 86400000).toISOString(), size: '2.3 GB', type: 'Full Database', status: 'Completed' }
    ];
    res.status(200).json({ success: true, data: backups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get active coupons (Mock implementation)
// @route   GET /api/v1/system/coupons
// @access  Private (Super Admin)
exports.getCoupons = async (req, res) => {
  try {
    const coupons = [
      { code: 'DIWALI20', discount: '20% OFF', type: 'First Year Only', used: 145, usageLimit: 500, validUntil: '2024-11-15', status: 'Active' },
      { code: 'WELCOME50', discount: '₹50,000 OFF', type: 'Setup Fee Waiver', used: 12, usageLimit: 50, validUntil: '2024-12-31', status: 'Active' }
    ];
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
