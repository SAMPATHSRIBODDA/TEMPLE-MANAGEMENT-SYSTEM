const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(inventoryController.getProducts)
  .post(inventoryController.createProduct);

router
  .route('/:id')
  .get(inventoryController.getProduct)
  .put(inventoryController.updateProduct);

module.exports = router;
