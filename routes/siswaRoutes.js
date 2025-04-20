const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');
const { verifyToken, isAdmin, isGuru } = require('../middleware/authMiddleware');

// ✅ Semua route CRUD siswa hanya admin
router.get('/', verifyToken, isAdmin, siswaController.getAllSiswa);
router.post('/', verifyToken, isAdmin, siswaController.createSiswa);
router.put('/:id', verifyToken, isAdmin, siswaController.updateSiswa);
router.delete('/:id', verifyToken, isAdmin, siswaController.deleteSiswa);

// ✅ REVISI ➡️ Guru butuh akses data siswa by kelas_id
router.get('/kelas', verifyToken, isGuru, siswaController.getSiswaByKelas);

module.exports = router;
