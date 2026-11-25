const express = require('express');
const router = express.Router();
const pujaController = require('../controllers/pujaController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(pujaController.getPujas)
  .post(pujaController.createPuja);

router
  .route('/:id')
  .get(pujaController.getPuja)
  .put(pujaController.updatePuja);

module.exports = router;
