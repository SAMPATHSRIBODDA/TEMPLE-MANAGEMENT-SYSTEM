const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('Super Admin'));

router.get('/plans', subscriptionController.getPlans);
router.post('/plans', subscriptionController.createPlan);

router.get('/', subscriptionController.getSubscriptions);
router.post('/', subscriptionController.createSubscription);

module.exports = router;
