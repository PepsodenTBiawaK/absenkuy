const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporanController");
const { verifyToken, isAdmin, isSiswa, isGuru } = require("../middleware/authMiddleware");

// Admin route
router.get("/rekap", verifyToken, isAdmin, laporanController.rekapSemuaKelas);
router.get("/kelas/:kelasId", verifyToken, isAdmin, laporanController.rekapPerKelas);
router.get("/siswa/:siswaId", verifyToken, isAdmin, laporanController.rekapPerSiswa);
router.get("/rekap/kelas", laporanController.rekapAbsensiPerKelas);

//Guru Route
router.get('/rekap/guru', verifyToken, isGuru, laporanController.rekapAbsensiKelasGuru);
// Guru - Riwayat Absensi berdasarkan kelas
router.get("/guru/kelas/:kelasId", verifyToken, isGuru, laporanController.rekapKelasUntukGuru);


// Siswa route
router.get("/saya", verifyToken, isSiswa, laporanController.laporanSaya);

module.exports = router;
