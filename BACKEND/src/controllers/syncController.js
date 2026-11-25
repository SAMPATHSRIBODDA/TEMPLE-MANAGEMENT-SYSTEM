const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Receipt = require('../models/Receipt');

exports.offlineSync = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tickets, receipts } = req.body; // Arrays of offline generated data

    if (tickets && tickets.length > 0) {
      await Ticket.insertMany(tickets, { session });
    }

    if (receipts && receipts.length > 0) {
      await Receipt.insertMany(receipts, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Offline data synchronized successfully',
      data: {
        syncedTickets: tickets ? tickets.length : 0,
        syncedReceipts: receipts ? receipts.length : 0
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: 'Sync failed: ' + error.message });
  }
};
