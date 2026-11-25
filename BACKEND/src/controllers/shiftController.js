const Shift = require('../models/Shift');
const Receipt = require('../models/Receipt');
const mongoose = require('mongoose');

// Helper to calculate live totals for a given shift
const calculateShiftTotals = async (shift) => {
  const endTime = shift.endTime || new Date();
  
  // Find all valid receipts created by this user since the shift started, and before it ended
  const receipts = await Receipt.find({
    templeId: shift.templeId,
    issuedBy: shift.userId,
    status: 'valid',
    createdAt: { $gte: shift.startTime, $lte: endTime }
  });

  let systemCashSales = 0;
  let systemOnlineSales = 0;
  const categoryBreakdown = {};

  receipts.forEach(r => {
    if (r.paymentMethod === 'Cash') {
      systemCashSales += r.totalAmount;
    } else {
      systemOnlineSales += r.totalAmount;
    }

    r.items.forEach(item => {
      const cat = item.categoryName || item.itemType || 'Other';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { cash: 0, online: 0 };
      }
      if (r.paymentMethod === 'Cash') {
        categoryBreakdown[cat].cash += (item.quantity * (item.price || 0));
      } else {
        categoryBreakdown[cat].online += (item.quantity * (item.price || 0));
      }
    });
  });

  return { systemCashSales, systemOnlineSales, categoryBreakdown };
};

exports.openShift = async (req, res) => {
  try {
    const { openingBalance } = req.body;
    
    // Check if user already has an open shift
    const existingShift = await Shift.findOne({
      templeId: req.user.templeId,
      userId: req.user._id,
      status: 'Open'
    });

    if (existingShift) {
      return res.status(400).json({ success: false, message: 'You already have an open shift.' });
    }

    const newShift = new Shift({
      templeId: req.user.templeId,
      userId: req.user._id,
      openingBalance: parseFloat(openingBalance) || 0
    });

    await newShift.save();
    res.json({ success: true, data: newShift });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCurrentShift = async (req, res) => {
  try {
    const shift = await Shift.findOne({
      templeId: req.user.templeId,
      userId: req.user._id,
      status: 'Open'
    });

    if (!shift) {
      return res.json({ success: true, data: null });
    }

    const totals = await calculateShiftTotals(shift);
    
    res.json({ 
      success: true, 
      data: {
        ...shift.toObject(),
        systemCashSales: totals.systemCashSales,
        systemOnlineSales: totals.systemOnlineSales,
        categoryBreakdown: totals.categoryBreakdown,
        expectedCash: shift.openingBalance + totals.systemCashSales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.closeShift = async (req, res) => {
  try {
    const { physicalCashCounted, discrepancyReason } = req.body;
    
    const shift = await Shift.findOne({
      templeId: req.user.templeId,
      userId: req.user._id,
      status: 'Open'
    });

    if (!shift) {
      return res.status(404).json({ success: false, message: 'No open shift found.' });
    }

    const totals = await calculateShiftTotals(shift);
    
    shift.endTime = new Date();
    shift.status = 'Pending Verification';
    shift.systemCashSales = totals.systemCashSales;
    shift.systemOnlineSales = totals.systemOnlineSales;
    shift.categoryBreakdown = totals.categoryBreakdown;
    
    shift.physicalCashCounted = parseFloat(physicalCashCounted) || 0;
    
    const expectedCash = shift.openingBalance + shift.systemCashSales;
    shift.discrepancy = shift.physicalCashCounted - expectedCash;
    if (shift.discrepancy !== 0 && discrepancyReason) {
      shift.discrepancyReason = discrepancyReason;
    }

    await shift.save();
    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const { date } = req.query; // format YYYY-MM-DD
    
    let startOfDay, endOfDay;
    if (date) {
      startOfDay = new Date(date);
      startOfDay.setHours(0,0,0,0);
      endOfDay = new Date(date);
      endOfDay.setHours(23,59,59,999);
    } else {
      startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      endOfDay = new Date();
      endOfDay.setHours(23,59,59,999);
    }

    const shifts = await Shift.find({
      templeId: req.user.templeId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'name role').sort({ startTime: -1 });

    const summary = {
      totalShifts: shifts.length,
      totalExpectedCash: 0,
      totalPhysicalCash: 0,
      totalDiscrepancy: 0,
      totalOnline: 0,
      categoryBreakdown: {}
    };

    shifts.forEach(s => {
      if (s.status === 'Verified') {
        const expected = s.openingBalance + s.systemCashSales;
        summary.totalExpectedCash += expected;
        summary.totalPhysicalCash += s.physicalCashCounted;
        summary.totalDiscrepancy += s.discrepancy;
        summary.totalOnline += s.systemOnlineSales;
        
        // Aggregate category breakdown
        if (s.categoryBreakdown) {
          Object.entries(s.categoryBreakdown).forEach(([cat, amounts]) => {
            if (!summary.categoryBreakdown[cat]) {
              summary.categoryBreakdown[cat] = { cash: 0, online: 0 };
            }
            summary.categoryBreakdown[cat].cash += amounts.cash || 0;
            summary.categoryBreakdown[cat].online += amounts.online || 0;
          });
        }
      }
    });

    res.json({ success: true, data: shifts, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPendingShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({
      templeId: req.user.templeId,
      status: 'Pending Verification'
    }).populate('userId', 'name role').sort({ endTime: -1 });

    res.json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyShift = async (req, res) => {
  try {
    const shiftId = req.params.id;
    const shift = await Shift.findOne({ _id: shiftId, templeId: req.user.templeId });

    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found.' });
    }

    shift.status = 'Verified';
    await shift.save();

    res.json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
