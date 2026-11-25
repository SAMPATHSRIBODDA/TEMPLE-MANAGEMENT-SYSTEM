const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(staffController.getStaff)
  .post(staffController.createStaff);

router
  .route('/:id')
  .get(staffController.getStaffById)
  .put(staffController.updateStaff);

module.exports = router;
