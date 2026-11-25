const TicketCategory = require('../models/TicketCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await TicketCategory.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { items, sectionName } = req.body;
    
    // If sectionName is provided, only replace items in that section
    if (sectionName) {
      await TicketCategory.deleteMany({ sectionName });
      if (items && items.length > 0) {
        const toInsert = items.map(item => ({
          name: item.name,
          price: item.price,
          sectionName: sectionName,
          isActive: item.isActive !== undefined ? item.isActive : true
        }));
        await TicketCategory.insertMany(toInsert);
      }
    } else {
      // If we are passing the whole list (fallback)
      await TicketCategory.deleteMany({});
      if (items && items.length > 0) {
        await TicketCategory.insertMany(items);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
