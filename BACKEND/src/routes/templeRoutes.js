const express = require('express');
const router = express.Router();
const templeController = require('../controllers/templeController');
const { upload } = require('../utils/cloudinary');
const { protect } = require('../middlewares/authMiddleware'); // assuming we have protect middleware, else public for now

// For now leaving the POST open or using basic structure. In production use protect.
router.get('/core-data', templeController.getCoreData);
router.post('/core-data', upload.single('profileImage'), templeController.updateCoreData);

module.exports = router;
