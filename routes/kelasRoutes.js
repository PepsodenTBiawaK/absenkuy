// routes/kelasRoutes.js
const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');
const { verifyToken, isAdmin, isGuru } = require('../middleware/authMiddleware');

// ✅ Route untuk Admin
router.get('/', verifyToken, isAdmin, kelasController.getAllKelas);
router.post('/', verifyToken, isAdmin, kelasController.createKelas);
router.put('/:id', verifyToken, isAdmin, kelasController.updateKelas);
router.delete('/:id', verifyToken, isAdmin, kelasController.deleteKelas);

// ✅ REVISI: Route untuk Guru ambil kelas yang dia pegang
router.get('/guru', verifyToken, isGuru, kelasController.getKelasGuru);

module.exports = router;
