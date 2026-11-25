const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin'));

router.get('/settings', systemController.getSettings);
router.put('/settings/:type', systemController.updateSetting);

router.get('/backups', systemController.getBackups);
router.get('/coupons', systemController.getCoupons);

module.exports = router;
