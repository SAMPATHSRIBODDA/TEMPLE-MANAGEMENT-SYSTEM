const Employee = require('../models/Employee');

// @desc    Get all employees (staff)
// @route   GET /api/v1/staff
// @access  Private
exports.getStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { templeId: req.user.templeId };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } }
      ];
    }

    const staff = await Employee.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      data: staff,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('getStaff error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new employee
// @route   POST /api/v1/staff
// @access  Private
exports.createStaff = async (req, res) => {
  try {
    req.body.templeId = req.user.templeId;
    const staff = await Employee.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    console.error('createStaff error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single employee
// @route   GET /api/v1/staff/:id
// @access  Private
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Employee.findOne({ _id: req.params.id, templeId: req.user.templeId });
    if (!staff) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update employee
// @route   PUT /api/v1/staff/:id
// @access  Private
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Employee.findOneAndUpdate(
      { _id: req.params.id, templeId: req.user.templeId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!staff) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
