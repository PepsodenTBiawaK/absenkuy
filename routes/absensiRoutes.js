const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');
const { verifyToken, isGuru } = require('../middleware/authMiddleware');

// Guru routes
router.get('/', verifyToken, isGuru, absensiController.getAllAbsensi);
router.post('/', verifyToken, isGuru, absensiController.createAbsensi);
router.put('/:id', verifyToken, isGuru, absensiController.updateAbsensi);
router.delete('/:id', verifyToken, isGuru, absensiController.deleteAbsensi);

module.exports = router;
