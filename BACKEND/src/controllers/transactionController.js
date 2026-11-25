const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const LadduOrder = require('../models/LadduOrder');
const Donation = require('../models/Donation');

// Helper to broadcast real-time update to all connected clients
const broadcastUpdate = (req) => {
  const io = req.app.get('socketio');
  if (io) io.emit('DASHBOARD_UPDATE', { timestamp: Date.now() });
};

// POST /api/v1/transactions  — Counter staff creates a sale
exports.createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, paymentMethod, totalAmount } = req.body;
    const templeId = req.user.templeId;

    const receipt = new Receipt({
      templeId,
      receiptNumber: `RCT-${Date.now()}`,
      issuedBy: req.user._id,
      totalAmount,
      paymentMethod,
      items: []
    });

    for (const item of items) {
      if (item.type === 'Ticket') {
        const qty = item.quantity || 1;
        const ticket = new Ticket({
          templeId,
          ticketNumber: `TKT-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,
          ticketType: item.name || 'General Ticket',
          sectionName: item.sectionName || (item.name?.includes('Darshan') ? 'Darshan' : 'Entry Tickets'),
          price: item.price,
          adultCount: qty, // Single QR for all persons
          validForDate: new Date(),
          qrCode: `QR-${Math.random().toString(36).substr(2,9)}`,
          issuedBy: req.user._id,
          status: 'issued'
        });
        await ticket.save({ session });
        receipt.items.push({ itemType: 'Ticket', referenceId: ticket._id, price: item.price, quantity: qty, categoryName: ticket.sectionName, description: ticket.ticketType });
      } else if (item.type === 'Laddu') {
        const ladduProductId = new mongoose.Types.ObjectId();
        const laddu = new LadduOrder({
          templeId,
          productId: ladduProductId,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          orderType: 'Counter',
          status: 'collected',
          issuedBy: req.user._id
        });
        await laddu.save({ session });
        receipt.items.push({ itemType: 'LadduOrder', referenceId: laddu._id, price: item.price, quantity: item.quantity, categoryName: 'Laddu Sales', description: 'Laddu Prasad' });
      } else if (item.type === 'Donation') {
        const donation = new Donation({
          templeId,
          donorName: 'Anonymous',
          amount: item.price,
          donationCategory: item.name || 'General Donation',
          paymentMethod
        });
        await donation.save({ session });
        receipt.items.push({ itemType: 'Donation', referenceId: donation._id, price: item.price, quantity: 1, categoryName: 'Donations', description: donation.donationCategory });
      }
    }

    await receipt.save({ session });

    const payment = new Payment({
      templeId,
      receiptId: receipt._id,
      amount: totalAmount,
      method: paymentMethod,
      status: 'captured'
    });
    await payment.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Broadcast to all dashboards via socket
    broadcastUpdate(req);

    res.status(201).json({ success: true, data: receipt });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/v1/transactions  — paginated transaction list
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, section, startDate, endDate, date, counterId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matchStage = { templeId: req.user.templeId };
    
    // Dynamic Section filtering
    if (section && section !== 'All') {
      if (section === 'Laddu Sales') matchStage['items.categoryName'] = 'Laddu Sales';
      else if (section === 'Poojas') matchStage['items.itemType'] = 'Pooja'; // Or use categoryName if we saved it
      else if (section === 'Donations') matchStage['items.itemType'] = 'Donation';
      else matchStage['items.categoryName'] = section;
    }
    
    // Counter filtering
    if (counterId && counterId !== 'All') {
      const mongoose = require('mongoose');
      matchStage.issuedBy = new mongoose.Types.ObjectId(counterId);
    }

    // Date Filtering
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (date) {
      const d = new Date(date);
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      matchStage.createdAt = { $gte: d, $lt: next };
    }

    let query = Receipt.find(matchStage)
      .populate('issuedBy', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const [receipts, total] = await Promise.all([
      query,
      Receipt.countDocuments(matchStage)
    ]);
    
    // Calculate Section Totals
    const cashTotalAggr = await Receipt.aggregate([
      { $match: { ...matchStage, paymentMethod: 'Cash' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const onlineTotalAggr = await Receipt.aggregate([
      { $match: { ...matchStage, paymentMethod: { $in: ['UPI', 'Card', 'Bank Transfer'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const sectionTotals = {
      cash: cashTotalAggr[0]?.total || 0,
      online: onlineTotalAggr[0]?.total || 0,
      total: (cashTotalAggr[0]?.total || 0) + (onlineTotalAggr[0]?.total || 0)
    };

    res.json({ success: true, data: receipts, total, sectionTotals, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/transactions/summary  — today's summary for closing dashboard
exports.getTransactionSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const templeId = req.user.templeId;

    const [cashTotal, onlineTotal, donationTotal, ticketCount, ladduTotal] = await Promise.all([
      Payment.aggregate([
        { $match: { templeId, status: 'captured', method: 'Cash', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { templeId, status: 'captured', method: { $in: ['UPI', 'Card'] }, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Donation.aggregate([
        { $match: { templeId, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Ticket.countDocuments({ templeId, validForDate: { $gte: today }, status: { $in: ['issued', 'used'] } }),
      LadduOrder.aggregate([
        { $match: { templeId, createdAt: { $gte: today }, status: 'collected' } },
        { $group: { _id: null, qty: { $sum: '$quantity' }, rev: { $sum: '$totalPrice' } } }
      ])
    ]);

    const cash = cashTotal[0]?.total || 0;
    const online = onlineTotal[0]?.total || 0;

    res.json({
      success: true,
      data: {
        cashCollection: cash,
        onlineCollection: online,
        totalRevenue: cash + online,
        donationTotal: donationTotal[0]?.total || 0,
        ticketCount,
        ladduQuantity: ladduTotal[0]?.qty || 0,
        ladduRevenue: ladduTotal[0]?.rev || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/transactions/reports?period=daily|monthly|yearly
exports.getReport = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;

    let startDate = new Date();
    let groupFormat = '%Y-%m-%d';

    if (period === 'monthly') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 11, 1);
      groupFormat = '%Y-%m';
    } else if (period === 'yearly') {
      startDate = new Date(startDate.getFullYear() - 4, 0, 1);
      groupFormat = '%Y';
    } else {
      // daily — last 30 days
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
    }

    const revenueByPeriod = await Payment.aggregate([
      { $match: { status: 'captured', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          cash: { $sum: { $cond: [{ $eq: ['$method', 'Cash'] }, '$amount', 0] } },
          online: { $sum: { $cond: [{ $ne: ['$method', 'Cash'] }, '$amount', 0] } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: revenueByPeriod });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/transactions/tickets — fetch tickets for wallet
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/transactions/online-bookings — fetch unified online bookings by category
exports.getOnlineBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // For now, to allow testing and demonstrate the UI, we will fetch the underlying items 
    // across the system depending on category, mimicking "Online" source.
    let data = [];
    let total = 0;
    
    if (category === 'Laddu Sales') {
      const query = LadduOrder.find({ templeId: req.user.templeId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
      const [orders, count] = await Promise.all([query, LadduOrder.countDocuments({ templeId: req.user.templeId })]);
      data = orders.map(o => ({
        id: o._id,
        transactionId: o.productId, // using productId as proxy
        time: o.createdAt,
        name: 'Devotee',
        itemBooked: 'Laddu Prasad',
        quantity: o.quantity,
        status: o.status
      }));
      total = count;
    } 
    else if (category === 'Poojas') {
      const match = { templeId: req.user.templeId, 'items.itemType': 'Pooja' };
      const query = Receipt.find(match).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
      const [receipts, count] = await Promise.all([query, Receipt.countDocuments(match)]);
      
      receipts.forEach(r => {
        r.items.filter(i => i.itemType === 'Pooja').forEach(i => {
          data.push({
            id: r._id + '_' + i._id,
            transactionId: r.receiptNumber,
            time: r.createdAt,
            name: r.issuedToName || 'Devotee',
            itemBooked: i.description || 'Pooja Booking',
            quantity: i.quantity,
            status: r.status === 'valid' ? 'Used' : 'Not Used' // Mocking usage status for pooja
          });
        });
      });
      total = count;
    }
    else {
      // Entry Tickets & Darshan
      const sectionMatch = category || 'Entry Tickets';
      const match = { templeId: req.user.templeId, sectionName: sectionMatch };
      const query = Ticket.find(match).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
      const [tickets, count] = await Promise.all([query, Ticket.countDocuments(match)]);
      data = tickets.map(t => ({
        id: t._id,
        transactionId: t.ticketNumber,
        time: t.createdAt,
        name: 'Devotee',
        itemBooked: t.ticketType,
        quantity: t.adultCount + t.childCount,
        status: t.status
      }));
      total = count;
    }

    res.json({ success: true, data, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/v1/transactions/app-transactions — fetch detailed online app payments
exports.getAppTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, section } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Identify app transactions by filtering online payments that have a userId attached (Mobile App auth)
    // or filtering out counter sales (where userId is often not present on Payment but exists on offline flows).
    // For TMS, we'll assume App transactions are online (method in UPI/Card) and have userId.
    const matchStage = { 
      templeId: req.user.templeId,
      method: { $in: ['UPI', 'Card', 'Bank Transfer'] },
      userId: { $exists: true }
    };
    
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (section && section !== 'All') {
      matchStage.referenceModel = section; // Assuming referenceModel maps to section (e.g. LadduOrder, Pooja, Ticket)
      // Actually, let's map section string to model names
      if (section === 'Laddu Sales') matchStage.referenceModel = 'LadduOrder';
      else if (section === 'Poojas') matchStage.referenceModel = 'Pooja';
      else if (section === 'Donations') matchStage.referenceModel = 'Donation';
      else {
        // If it's a dynamic ticket category like VIP Darshan, we might just query Tickets. 
        // We'll leave referenceModel='Ticket' but ideally we need to match exactly.
        matchStage.referenceModel = 'Ticket';
      }
    }
    
    const query = Payment.find(matchStage)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const [payments, total] = await Promise.all([
      query,
      Payment.countDocuments(matchStage)
    ]);

    // Calculate Section Totals
    const upiTotalAggr = await Payment.aggregate([
      { $match: { ...matchStage, method: 'UPI' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const cardTotalAggr = await Payment.aggregate([
      { $match: { ...matchStage, method: { $in: ['Card', 'Bank Transfer'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const sectionTotals = {
      upi: upiTotalAggr[0]?.total || 0,
      card: cardTotalAggr[0]?.total || 0,
      total: (upiTotalAggr[0]?.total || 0) + (cardTotalAggr[0]?.total || 0)
    };
    
    // Map them to detailed view
    const data = payments.map(p => ({
      _id: p._id,
      transactionId: p.razorpayPaymentId || p._id,
      date: p.createdAt,
      user: p.userId ? `${p.userId.name} (${p.userId.phone})` : 'App Devotee',
      amount: p.amount,
      method: p.method,
      status: p.status,
      module: p.referenceModel || 'App Service'
    }));
    
    res.json({ success: true, data, total, sectionTotals, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
