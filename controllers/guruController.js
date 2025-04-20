const Guru = require('../models/User');
const bcrypt = require('bcrypt');

// Ambil semua guru
exports.getAllGuru = async (req, res) => {
  try {
    const gurus = await Guru.findAll({ where: { role: 'guru' } });
    res.json(gurus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah guru baru
exports.createGuru = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingGuru = await Guru.findOne({ where: { name } });
    if (existingGuru) {
     return res.status(400).json({ message: 'Nama guru sudah digunakan' });
    }

    const exist = await Guru.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newGuru = await Guru.create({
      name,
      email,
      password: hashedPassword,
      role: 'guru'
    });

    res.status(201).json({ message: 'Guru berhasil ditambahkan', guru: newGuru });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update data guru
exports.updateGuru = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const guru = await Guru.findOne({ where: { id, role: 'guru' } });
    if (!guru) return res.status(404).json({ message: 'Guru tidak ditemukan' });

    const existingGuru = await Guru.findOne({ where: { name } });
    if (existingGuru) {
     return res.status(400).json({ message: 'Nama guru sudah digunakan' });
    }

    guru.name = name || guru.name;
    guru.email = email || guru.email;

    if (password) {
      guru.password = await bcrypt.hash(password, 10);
    }

    await guru.save();

    res.json({ message: 'Guru berhasil diupdate', guru });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Hapus guru
exports.deleteGuru = async (req, res) => {
  const { id } = req.params;

  try {
    const guru = await Guru.findOne({ where: { id, role: 'guru' } });
    if (!guru) return res.status(404).json({ message: 'Guru tidak ditemukan' });

    await guru.destroy();
    res.json({ message: 'Guru berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
