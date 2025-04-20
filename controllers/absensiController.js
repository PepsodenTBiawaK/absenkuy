const Absensi = require('../models/Absensi');
const Siswa = require('../models/Siswa');
const Kelas = require('../models/Kelas');

// Ambil semua absensi
exports.getAllAbsensi = async (req, res) => {
  try {
    const absensi = await Absensi.findAll({
      include: [
        { model: Siswa, as: 'siswa', attributes: ['id', 'nama_siswa', 'nisn'] },
        { model: Kelas, as: 'kelas', attributes: ['id', 'nama_kelas'] }
      ]
    });
    res.json(absensi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Tambah absensi (by guru)

exports.createAbsensi = async (req, res) => {
  const { kelas_id, tanggal, absensi } = req.body;

  try {
    for (const data of absensi) {
      const { siswa_id, status } = data;

      // Cek apakah data absensi sudah ada
      const existing = await Absensi.findOne({
        where: {
          siswa_id,
          kelas_id,
          tanggal
        }
      });

      if (existing) {
        // Update jika sudah ada
        existing.status = status;
        await existing.save();
      } else {
        // Jika belum ada, buat baru
        await Absensi.create({
          siswa_id,
          kelas_id,
          tanggal,
          status
        });
      }
    }

    res.status(200).json({ message: "Absensi berhasil disimpan / diperbarui" });
  } catch (err) {
    console.error("Gagal menyimpan absensi:", err);
    res.status(500).json({ message: "Gagal menyimpan absensi" });
  }
};



// Update absensi
exports.updateAbsensi = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const absensi = await Absensi.findByPk(id);
    if (!absensi) return res.status(404).json({ message: 'Absensi tidak ditemukan' });

    absensi.status = status;
    await absensi.save();

    res.json({ message: 'Absensi berhasil diupdate', absensi });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus absensi
exports.deleteAbsensi = async (req, res) => {
  const { id } = req.params;

  try {
    const absensi = await Absensi.findByPk(id);
    if (!absensi) return res.status(404).json({ message: 'Absensi tidak ditemukan' });

    await absensi.destroy();

    res.json({ message: 'Absensi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
