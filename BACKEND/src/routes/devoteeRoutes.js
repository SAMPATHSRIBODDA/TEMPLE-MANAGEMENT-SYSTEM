const express = require('express');
const router = express.Router();
const devoteeController = require('../controllers/devoteeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(devoteeController.getDevotees)
  .post(devoteeController.createDevotee);

router
  .route('/:id')
  .get(devoteeController.getDevotee)
  .put(devoteeController.updateDevotee)
  .delete(authorize('Super Admin', 'Temple Admin'), devoteeController.deleteDevotee);

module.exports = router;
