const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

// Add dummy user if no token provided (since frontend currently runs mocked auth)
router.use((req, res, next) => {
  if (!req.user) {
    req.user = { templeId: '60d5ecb8b392d700153f3a00' };
  }
  next();
});

// Create a transaction (counter sale)
router.post('/', transactionController.createTransaction);

// Get transaction list (paginated)
router.get('/', transactionController.getTransactions);

// Get today's summary (for closing dashboard)
router.get('/summary', transactionController.getTransactionSummary);

// Get report data
router.get('/reports', transactionController.getReport);

// Get app transactions
router.get('/app-transactions', transactionController.getAppTransactions);

// Get online bookings by category
router.get('/online-bookings', transactionController.getOnlineBookings);

// Get tickets for wallet
router.get('/tickets', transactionController.getTickets);

module.exports = router;
