const Temple = require('../models/Temple');

// @desc    Get core temple data
// @route   GET /api/v1/temple/core-data
// @access  Public
exports.getCoreData = async (req, res) => {
  try {
    // Assuming there's only one master temple record for now
    let temple = await Temple.findOne();
    if (!temple) {
      temple = await Temple.create({ name: 'Sri Venkateswara Swamy Temple' });
    }
    res.status(200).json({ success: true, data: temple });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update core temple data with image upload
// @route   POST /api/v1/temple/core-data
// @access  Private
exports.updateCoreData = async (req, res) => {
  try {
    const { name, address, phone, email, taxId, timings, festivals } = req.body;
    let temple = await Temple.findOne();
    
    if (!temple) {
      temple = new Temple({ name: name || 'New Temple' });
    }

    if (name !== undefined) temple.name = name;
    if (address !== undefined) temple.address = { ...temple.address, street: address };
    if (phone !== undefined) temple.phone = phone; 
    if (email !== undefined) temple.email = email;
    if (taxId !== undefined) temple.taxId = taxId;
    
    // Parse JSON arrays if they are sent as strings from FormData
    if (timings) {
      try {
        temple.timings = typeof timings === 'string' ? JSON.parse(timings) : timings;
      } catch(e) { console.error("Error parsing timings", e); }
    }

    if (festivals) {
      try {
        temple.festivals = typeof festivals === 'string' ? JSON.parse(festivals) : festivals;
      } catch(e) { console.error("Error parsing festivals", e); }
    }

    // Handle Cloudinary image upload
    if (req.file && req.file.path) {
      temple.profileImage = req.file.path; // Cloudinary secure url
    }

    await temple.save();
    res.status(200).json({ success: true, data: temple });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
