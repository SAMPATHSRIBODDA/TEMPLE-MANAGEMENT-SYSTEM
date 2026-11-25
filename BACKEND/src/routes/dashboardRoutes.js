const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', protect, dashboardController.getDashboardStats);
router.get('/revenue', protect, authorize('Super Admin'), dashboardController.getRevenueDashboard);

module.exports = router;
