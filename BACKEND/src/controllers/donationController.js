const Donation = require('../models/Donation');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

// @desc    Get all donations
// @route   GET /api/v1/donations
// @access  Private
exports.getDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { templeId: req.user.templeId };

    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { donorPhone: { $regex: search, $options: 'i' } }
      ];
    }

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Donation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: donations,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('getDonations error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new donation
// @route   POST /api/v1/donations
// @access  Private
exports.createDonation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    req.body.templeId = req.user.templeId;
    const donation = await Donation.create([req.body], { session });

    const Receipt = require('../models/Receipt');
    const receipt = new Receipt({
      templeId: req.user.templeId,
      receiptNumber: `RCT-${Date.now()}`,
      issuedBy: req.user._id || req.user.templeId,
      issuedToName: req.body.donorName || 'Anonymous',
      issuedToPhone: req.body.donorPhone,
      totalAmount: req.body.amount,
      paymentMethod: req.body.paymentMethod || 'Cash',
      items: [{
        itemType: 'Donation',
        referenceId: donation[0]._id,
        price: req.body.amount,
        quantity: 1
      }]
    });
    await receipt.save({ session });

    const payment = new Payment({
      templeId: req.user.templeId,
      receiptId: receipt._id,
      amount: req.body.amount,
      method: req.body.paymentMethod || 'Cash',
      status: 'captured'
    });
    await payment.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Broadcast to dashboards
    const io = req.app.get('socketio');
    if (io) io.emit('DASHBOARD_UPDATE', { timestamp: Date.now() });

    res.status(201).json({ success: true, data: donation[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('createDonation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const { spawn } = require('child_process');
const path = require('path');

// @desc    Get donations sorted by C++ Merge Sort algorithm
// @route   GET /api/v1/donations/optimized-sort
// @access  Private
exports.getDonationsSortedByCPP = async (req, res) => {
  try {
    const query = { templeId: req.user.templeId };
    const donations = await Donation.find(query).exec();

    if (donations.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Convert data to CSV format for C++
    let inputData = '';
    donations.forEach(d => {
      inputData += `${d._id},${d.donorName || 'Anonymous'},${d.amount}\n`;
    });

    // Spawn C++ Executable
    const exePath = path.join(__dirname, '../utils/cpp_dsa_engine/MergeSortEngine.exe');
    const cppProcess = spawn(exePath);

    let outputData = '';
    let errorData = '';

    cppProcess.stdout.on('data', (data) => { outputData += data.toString(); });
    cppProcess.stderr.on('data', (data) => { errorData += data.toString(); });

    cppProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`C++ process exited with code ${code}: ${errorData}`);
        return res.status(500).json({ success: false, message: 'C++ Engine Error' });
      }

      // Parse C++ sorted CSV back into JSON array
      const sortedDonations = [];
      const lines = outputData.trim().split('\n');
      
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length === 3) {
          sortedDonations.push({
            _id: parts[0],
            donorName: parts[1],
            amount: Number(parts[2]),
          });
        }
      });

      res.status(200).json({
        success: true,
        data: sortedDonations,
        message: 'Sorted successfully using C++ Merge Sort algorithm (O(N log N))'
      });
    });

    // Send data to C++ stdin
    cppProcess.stdin.write(inputData);
    cppProcess.stdin.end();

  } catch (error) {
    console.error('getDonationsSortedByCPP error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

