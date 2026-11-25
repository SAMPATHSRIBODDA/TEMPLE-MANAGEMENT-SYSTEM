const express = require('express');
const router = express.router;
const accountingController = require('../controllers/accountingController');
const { protect, authorize } = require('../middleware/auth');

const appRouter = express.Router();

appRouter.use(protect);
appRouter.use(authorize('Admin', 'Accountant', 'SuperAdmin'));

appRouter.post('/expense', accountingController.addExpense);
appRouter.post('/income', accountingController.addIncome);
appRouter.get('/ledger', accountingController.getLedger);
appRouter.get('/summary', accountingController.getSummary);

module.exports = appRouter;
