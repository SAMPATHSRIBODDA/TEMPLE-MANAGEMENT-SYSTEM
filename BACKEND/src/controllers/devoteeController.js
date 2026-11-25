const Devotee = require('../models/Devotee');

// @desc    Get all devotees (with pagination, search, and filters)
// @route   GET /api/v1/devotees
// @access  Private
exports.getDevotees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Multi-tenant: filter by templeId from logged-in user
    const query = { templeId: req.user.templeId };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const devotees = await Devotee.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Devotee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: devotees,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('getDevotees error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new devotee
// @route   POST /api/v1/devotees
// @access  Private
exports.createDevotee = async (req, res) => {
  try {
    req.body.templeId = req.user.templeId;
    
    // Check if phone exists in this temple
    const existing = await Devotee.findOne({ templeId: req.user.templeId, phone: req.body.phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Devotee with this phone number already exists' });
    }

    const devotee = await Devotee.create(req.body);
    res.status(201).json({ success: true, data: devotee });
  } catch (error) {
    console.error('createDevotee error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single devotee
// @route   GET /api/v1/devotees/:id
// @access  Private
exports.getDevotee = async (req, res) => {
  try {
    const devotee = await Devotee.findOne({ _id: req.params.id, templeId: req.user.templeId });
    if (!devotee) {
      return res.status(404).json({ success: false, message: 'Devotee not found' });
    }
    res.status(200).json({ success: true, data: devotee });
  } catch (error) {
    console.error('getDevotee error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update devotee
// @route   PUT /api/v1/devotees/:id
// @access  Private
exports.updateDevotee = async (req, res) => {
  try {
    const devotee = await Devotee.findOneAndUpdate(
      { _id: req.params.id, templeId: req.user.templeId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!devotee) {
      return res.status(404).json({ success: false, message: 'Devotee not found' });
    }
    res.status(200).json({ success: true, data: devotee });
  } catch (error) {
    console.error('updateDevotee error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete devotee
// @route   DELETE /api/v1/devotees/:id
// @access  Private
exports.deleteDevotee = async (req, res) => {
  try {
    const devotee = await Devotee.findOneAndDelete({ _id: req.params.id, templeId: req.user.templeId });
    if (!devotee) {
      return res.status(404).json({ success: false, message: 'Devotee not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('deleteDevotee error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
