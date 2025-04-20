const Kelas = require('../models/Kelas');
const User = require('../models/User');

// Get Semua Kelas
exports.getAllKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll({
      include: [
        {
          model: User,
          as: 'guru',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(kelas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah Kelas Baru
exports.createKelas = async (req, res) => {
  const { nama_kelas, guru_id } = req.body;

  try {
    const existingKelas = await Kelas.findOne({ where: { nama_kelas } });
    if (existingKelas) {
     return res.status(400).json({ message: 'Nama kelas sudah digunakan' });
    }

    const guru = await User.findOne({ where: { id: guru_id, role: 'guru' } });
    if (!guru) return res.status(400).json({ message: 'Guru tidak ditemukan' });

    const kelas = await Kelas.create({ nama_kelas, guru_id });

    res.status(201).json({ message: 'Kelas berhasil dibuat', kelas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Kelas
exports.updateKelas = async (req, res) => {
  const { id } = req.params;
  const { nama_kelas, guru_id } = req.body;

  try {
    const kelas = await Kelas.findByPk(id);
    if (!kelas) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

    const existingKelas = await Kelas.findOne({ where: { nama_kelas } });
    if (existingKelas) {
     return res.status(400).json({ message: 'Nama kelas sudah digunakan' });
    }

    if (guru_id) {
      const guru = await User.findOne({ where: { id: guru_id, role: 'guru' } });
      if (!guru) return res.status(400).json({ message: 'Guru tidak ditemukan' });
      kelas.guru_id = guru_id;
    }

    kelas.nama_kelas = nama_kelas || kelas.nama_kelas;

    await kelas.save();

    res.json({ message: 'Kelas berhasil diupdate', kelas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus Kelas
exports.deleteKelas = async (req, res) => {
  const { id } = req.params;

  try {
    const kelas = await Kelas.findByPk(id);
    if (!kelas) return res.status(404).json({ message: 'Kelas tidak ditemukan' });

    await kelas.destroy();

    res.json({ message: 'Kelas berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ REVISI: Fungsi ambil kelas yang diampu guru
exports.getKelasGuru = async (req, res) => {
  const guruId = req.user.userId; // ✅ Pastikan ini dapat dari middleware verifyToken
  try {
    const kelas = await Kelas.findAll({
      where: { guru_id: guruId }
    });
    res.json(kelas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
