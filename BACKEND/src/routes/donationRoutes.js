const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router
  .route('/optimized-sort')
  .get(donationController.getDonationsSortedByCPP);

router
  .route('/')
  .get(donationController.getDonations)
  .post(donationController.createDonation);

module.exports = router;
