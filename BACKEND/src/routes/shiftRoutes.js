const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { protect, authorize } = require('../middlewares/auth');

// Counter staff routes
router.post('/open', protect, shiftController.openShift);
router.get('/current', protect, shiftController.getCurrentShift);
router.post('/close', protect, shiftController.closeShift);

// Admin / Accountant routes
router.get('/daily-summary', protect, authorize('admin', 'accountant'), shiftController.getDailySummary);

router.get('/pending', protect, authorize('admin', 'accountant'), shiftController.getPendingShifts);
router.post('/:id/verify', protect, authorize('admin', 'accountant'), shiftController.verifyShift);

module.exports = router;
