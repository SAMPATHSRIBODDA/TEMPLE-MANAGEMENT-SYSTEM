const InventoryProduct = require('../models/InventoryProduct');

// @desc    Get all inventory products
// @route   GET /api/v1/inventory
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { templeId: req.user.templeId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await InventoryProduct.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await InventoryProduct.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new inventory product
// @route   POST /api/v1/inventory
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    req.body.templeId = req.user.templeId;
    const product = await InventoryProduct.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single product
// @route   GET /api/v1/inventory/:id
// @access  Private
exports.getProduct = async (req, res) => {
  try {
    const product = await InventoryProduct.findOne({ _id: req.params.id, templeId: req.user.templeId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update product
// @route   PUT /api/v1/inventory/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const product = await InventoryProduct.findOneAndUpdate(
      { _id: req.params.id, templeId: req.user.templeId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
