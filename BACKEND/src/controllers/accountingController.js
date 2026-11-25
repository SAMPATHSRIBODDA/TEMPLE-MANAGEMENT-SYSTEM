const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Ticket = require('../models/Ticket');
const Donation = require('../models/Donation');
const LadduOrder = require('../models/LadduOrder');

exports.addExpense = async (req, res) => {
  try {
    const { amount, date, category, description, vendorName, paymentMethod, fundedBy } = req.body;
    
    const expense = new Expense({
      templeId: req.user.templeId,
      amount,
      date: date || new Date(),
      category,
      description,
      vendorName,
      paymentMethod,
      fundedBy,
      recordedBy: req.user._id
    });
    
    await expense.save();
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const { amount, date, category, description, sourceName, paymentMethod } = req.body;
    
    const income = new Income({
      templeId: req.user.templeId,
      amount,
      date: date || new Date(),
      category,
      description,
      sourceName,
      paymentMethod,
      recordedBy: req.user._id
    });
    
    await income.save();
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLedger = async (req, res) => {
  try {
    const templeId = req.user.templeId;
    const { page = 1, limit = 20, type = 'ALL', search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let queryOptions = { templeId };
    if (search) {
      queryOptions.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
        { sourceName: { $regex: search, $options: 'i' } }
      ];
    }
    
    let expenses = [];
    let incomes = [];
    
    if (type === 'ALL' || type === 'EXPENSE') {
      expenses = await Expense.find(queryOptions).lean();
      expenses = expenses.map(e => ({ ...e, type: 'EXPENSE', partyName: e.vendorName }));
    }
    
    if (type === 'ALL' || type === 'INCOME') {
      incomes = await Income.find(queryOptions).lean();
      incomes = incomes.map(i => ({ ...i, type: 'INCOME', partyName: i.sourceName }));
    }
    
    let combined = [...incomes, ...expenses];
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const total = combined.length;
    const paginatedData = combined.slice(skip, skip + parseInt(limit));
    
    res.json({ success: true, data: paginatedData, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const templeId = req.user.templeId;
    
    // Aggregations
    const [manualIncome, manualExpense, tickets, donations, laddus] = await Promise.all([
      Income.aggregate([{ $match: { templeId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { templeId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Ticket.aggregate([{ $match: { templeId, status: { $in: ['issued', 'used'] } } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
      Donation.aggregate([{ $match: { templeId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      LadduOrder.aggregate([{ $match: { templeId, status: 'collected' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }])
    ]);
    
    const totalManualIncome = manualIncome[0]?.total || 0;
    const totalTickets = tickets[0]?.total || 0;
    const totalDonations = donations[0]?.total || 0;
    const totalLaddus = laddus[0]?.total || 0;
    
    const totalIncome = totalManualIncome + totalTickets + totalDonations + totalLaddus;
    const totalExpense = manualExpense[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;
    
    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance,
        breakdown: {
          manualIncome: totalManualIncome,
          tickets: totalTickets,
          donations: totalDonations,
          laddus: totalLaddus,
          manualExpense: totalExpense
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
