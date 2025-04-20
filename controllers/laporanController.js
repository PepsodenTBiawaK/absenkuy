const Absensi = require("../models/Absensi");
const Siswa = require("../models/Siswa");
const Kelas = require("../models/Kelas");
const User = require("../models/User");

// Admin - Rekap per kelas
exports.rekapPerKelas = async (req, res) => {
  const { kelasId } = req.params;
  try {
    const absensi = await Absensi.findAll({
      where: { kelas_id: kelasId },
      include: [
        { model: Siswa, as: "siswa", attributes: ["id", "nama_siswa", "nisn"] },
        { model: Kelas, as: "kelas", attributes: ["id", "nama_kelas"] },
      ],
      order: [["tanggal", "DESC"]],
    });
    res.json({ message: `Rekap absensi untuk kelas ID: ${kelasId}`, absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin - Rekap per siswa
exports.rekapPerSiswa = async (req, res) => {
  const { siswaId } = req.params;
  try {
    const absensi = await Absensi.findAll({
      where: { siswa_id: siswaId },
      include: [
        { model: Siswa, as: "siswa", attributes: ["id", "nama_siswa", "nisn"] },
        { model: Kelas, as: "kelas", attributes: ["id", "nama_kelas"] },
      ],
      order: [["tanggal", "DESC"]],
    });
    res.json({ message: `Rekap absensi siswa ID: ${siswaId}`, absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Murid - Laporan pribadi (JWT -> userId -> siswa)
exports.laporanSaya = async (req, res) => {
  const userId = req.user.userId;
  try {
    const siswa = await Siswa.findOne({ where: { user_id: userId } });
    if (!siswa) return res.status(404).json({ message: "Data siswa tidak ditemukan" });

    const absensi = await Absensi.findAll({
      where: { siswa_id: siswa.id },
      include: [{ model: Kelas, as: "kelas", attributes: ["id", "nama_kelas"] }],
      order: [["tanggal", "DESC"]],
    });

    res.json({ message: `Laporan absensi pribadi`, absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin - Semua kelas
exports.rekapSemuaKelas = async (req, res) => {
  try {
    const absensi = await Absensi.findAll({
      include: [
        { model: Siswa, as: "siswa", attributes: ["id", "nama_siswa", "nisn"] },
        { model: Kelas, as: "kelas", attributes: ["id", "nama_kelas"] },
      ],
      order: [["tanggal", "DESC"]],
    });
    res.json({ message: "Rekap semua kelas", absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin - Chart absensi semua kelas
exports.rekapAbsensiPerKelas = async (req, res) => {
  try {
    const data = await Kelas.findAll({
      include: [{ model: Absensi, as: "absensi", attributes: ["status"] }],
    });

    const result = data.map((kelas) => {
      const absensi = kelas.absensi || [];
      return {
        kelas: kelas.nama_kelas,
        hadir: absensi.filter((a) => a.status === "hadir").length,
        izin: absensi.filter((a) => a.status === "izin").length,
        sakit: absensi.filter((a) => a.status === "sakit").length,
        alpa: absensi.filter((a) => a.status === "alpa").length,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Guru - Ambil rekap absensi per kelas yang dia ampu
exports.rekapKelasUntukGuru = async (req, res) => {
  const { kelasId } = req.params;
  const guruId = req.user.userId;

  try {
    // Pastikan kelas tersebut milik guru login
    const kelas = await Kelas.findOne({ where: { id: kelasId, guru_id: guruId } });
    if (!kelas) {
      return res.status(403).json({ message: "Anda tidak memiliki akses ke kelas ini" });
    }

    const absensi = await Absensi.findAll({
      where: { kelas_id: kelasId },
      include: [
        { model: Siswa, as: "siswa", attributes: ["id", "nama_siswa", "nisn"] },
        { model: Kelas, as: "kelas", attributes: ["id", "nama_kelas"] },
      ],
      order: [["tanggal", "DESC"]],
    });

    res.json({ message: `Rekap absensi kelas ${kelas.nama_kelas}`, absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Guru - Chart absensi hanya untuk kelas yang dia ampu
exports.rekapAbsensiKelasGuru = async (req, res) => {
  const guruId = req.user.userId; // dari JWT

  try {
    const kelasGuru = await Kelas.findAll({
      where: { guru_id: guruId },
      include: [
        {
          model: Absensi,
          as: "absensi",
          attributes: ["status"],
        },
      ],
    });

    const result = kelasGuru.map((kelas) => {
      const absensi = kelas.absensi || [];
      return {
        kelas: kelas.nama_kelas,
        hadir: absensi.filter((a) => a.status === "hadir").length,
        izin: absensi.filter((a) => a.status === "izin").length,
        sakit: absensi.filter((a) => a.status === "sakit").length,
        alpa: absensi.filter((a) => a.status === "alpa").length,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("❌ Error rekapAbsensiKelasGuru:", error);
    res.status(500).json({ message: error.message });
  }
};
