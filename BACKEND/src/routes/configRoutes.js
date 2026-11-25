const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin')); // Only Super Admins can manage global config

router.get('/temples', configController.getConfigTemples);

router.get('/app/:templeId', configController.getAppConfig);
router.put('/app/:templeId', configController.updateAppConfig);

router.get('/whitelabel/:templeId', configController.getWhiteLabel);
router.put('/whitelabel/:templeId', configController.updateWhiteLabel);

module.exports = router;
