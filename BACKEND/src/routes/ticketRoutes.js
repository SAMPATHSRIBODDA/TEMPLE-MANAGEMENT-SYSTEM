const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/validate', ticketController.validateTicket);
router.post('/mark-used', ticketController.markTicketUsed);

module.exports = router;
