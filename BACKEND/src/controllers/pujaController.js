const Pooja = require('../models/Pooja');

// @desc    Get all pujas
// @route   GET /api/v1/pujas
// @access  Private
exports.getPujas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { templeId: req.user.templeId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const pujas = await Pooja.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Pooja.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pujas,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('getPujas error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new puja
// @route   POST /api/v1/pujas
// @access  Private
exports.createPuja = async (req, res) => {
  try {
    req.body.templeId = req.user.templeId;
    const puja = await Pooja.create(req.body);
    res.status(201).json({ success: true, data: puja });
  } catch (error) {
    console.error('createPuja error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single puja
// @route   GET /api/v1/pujas/:id
// @access  Private
exports.getPuja = async (req, res) => {
  try {
    const puja = await Pooja.findOne({ _id: req.params.id, templeId: req.user.templeId });
    if (!puja) return res.status(404).json({ success: false, message: 'Puja not found' });
    res.status(200).json({ success: true, data: puja });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update puja
// @route   PUT /api/v1/pujas/:id
// @access  Private
exports.updatePuja = async (req, res) => {
  try {
    const puja = await Pooja.findOneAndUpdate(
      { _id: req.params.id, templeId: req.user.templeId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!puja) return res.status(404).json({ success: false, message: 'Puja not found' });
    res.status(200).json({ success: true, data: puja });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
