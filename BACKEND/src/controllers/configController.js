const AppConfig = require('../models/AppConfig');
const WhiteLabel = require('../models/WhiteLabel');
const Temple = require('../models/Temple');

// @desc    Get AppConfig for a specific temple
// @route   GET /api/v1/config/app/:templeId
// @access  Private (Super Admin)
exports.getAppConfig = async (req, res) => {
  try {
    const templeId = req.params.templeId;
    let config = await AppConfig.findOne({ templeId }).populate('templeId', 'name');
    
    if (!config) {
      // Create default if not exists
      config = await AppConfig.create({ templeId });
      config = await AppConfig.findById(config._id).populate('templeId', 'name');
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update AppConfig
// @route   PUT /api/v1/config/app/:templeId
// @access  Private (Super Admin)
exports.updateAppConfig = async (req, res) => {
  try {
    const templeId = req.params.templeId;
    let config = await AppConfig.findOneAndUpdate(
      { templeId },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get WhiteLabel config for a specific temple
// @route   GET /api/v1/config/whitelabel/:templeId
// @access  Private (Super Admin)
exports.getWhiteLabel = async (req, res) => {
  try {
    const templeId = req.params.templeId;
    let config = await WhiteLabel.findOne({ templeId }).populate('templeId', 'name');
    
    if (!config) {
      // Create default if not exists
      const temple = await Temple.findById(templeId);
      config = await WhiteLabel.create({ templeId, appName: temple ? temple.name : 'Temple Admin' });
      config = await WhiteLabel.findById(config._id).populate('templeId', 'name');
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update WhiteLabel config
// @route   PUT /api/v1/config/whitelabel/:templeId
// @access  Private (Super Admin)
exports.updateWhiteLabel = async (req, res) => {
  try {
    const templeId = req.params.templeId;
    let config = await WhiteLabel.findOneAndUpdate(
      { templeId },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all temples for config selector
// @route   GET /api/v1/config/temples
// @access  Private (Super Admin)
exports.getConfigTemples = async (req, res) => {
  try {
    const temples = await Temple.find().select('name _id status');
    res.status(200).json({ success: true, data: temples });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
