const express = require('express');
const router = express.Router();
const ticketCategoryController = require('../controllers/ticketCategoryController');

router.get('/', ticketCategoryController.getCategories);
router.post('/bulk', ticketCategoryController.updateCategories);

module.exports = router;
