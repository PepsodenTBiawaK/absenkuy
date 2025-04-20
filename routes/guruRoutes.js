const express = require('express');
const router = express.Router();
const guruController = require('../controllers/guruController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Semua route di bawah ini hanya untuk admin!
router.get('/', verifyToken, isAdmin, guruController.getAllGuru);
router.post('/', verifyToken, isAdmin, guruController.createGuru);
router.put('/:id', verifyToken, isAdmin, guruController.updateGuru);
router.delete('/:id', verifyToken, isAdmin, guruController.deleteGuru);

module.exports = router;
