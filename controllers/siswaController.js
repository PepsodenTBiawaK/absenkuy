const Siswa = require("../models/Siswa");
const Kelas = require("../models/Kelas");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Ambil semua siswa
exports.getAllSiswa = async (req, res) => {
  try {
    const siswa = await Siswa.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
    });
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah siswa baru + buat akun user siswa
exports.createSiswa = async (req, res) => {
  const { nama_siswa, nisn, kelas_id, email, password } = req.body;

  try {
    const existingName = await Siswa.findOne({ where: { nama_siswa } });
    if (existingName) {
      return res.status(400).json({ message: "Nama siswa sudah digunakan" });
    }

    const kelas = await Kelas.findByPk(kelas_id);
    if (!kelas) {
      return res.status(400).json({ message: "Kelas tidak ditemukan" });
    }

    const cekNisn = await Siswa.findOne({ where: { nisn } });
    if (cekNisn) {
      return res.status(400).json({ message: "NISN sudah digunakan" });
    }

    const cekEmail = await User.findOne({ where: { email } });
    if (cekEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userSiswa = await User.create({
      name: nama_siswa,
      email: email,
      password: hashedPassword,
      role: "siswa",
    });

    const siswa = await Siswa.create({
      nama_siswa,
      nisn,
      kelas_id,
      user_id: userSiswa.id,
    });

    res.status(201).json({
      message: "Siswa & akun berhasil ditambahkan",
      userSiswa,
      siswa,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update data siswa + user siswa
exports.updateSiswa = async (req, res) => {
  const { id } = req.params;
  const { nama_siswa, nisn, kelas_id, email, password } = req.body;

  try {
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    if (nama_siswa && nama_siswa != siswa.nama_siswa) {
      const existingName = await Siswa.findOne({ where: { nama_siswa } });
      if (existingName) {
        return res.status(400).json({ message: "Nama siswa sudah digunakan" });
      }
    }

    // Update data siswa
    if (kelas_id) {
      const kelas = await Kelas.findByPk(kelas_id);
      if (!kelas) return res.status(400).json({ message: "Kelas tidak ditemukan" });
      siswa.kelas_id = kelas_id;
    }

    siswa.nama_siswa = nama_siswa || siswa.nama_siswa;
    siswa.nisn = nisn || siswa.nisn;
    await siswa.save();

    // Update data user siswa
    const userSiswa = await User.findByPk(siswa.user_id);
    if (!userSiswa) return res.status(404).json({ message: "Akun user siswa tidak ditemukan" });

    if (email && email !== userSiswa.email) {
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) {
        return res.status(400).json({ message: "Email sudah digunakan" });
      }
      userSiswa.email = email;
    }

    userSiswa.name = nama_siswa || userSiswa.name;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userSiswa.password = hashedPassword;
    }

    await userSiswa.save();

    res.json({
      message: "Siswa & akun user berhasil diupdate",
      siswa,
      userSiswa,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus siswa + akun user siswa
// exports.deleteSiswa = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const siswa = await Siswa.findByPk(id);
//     if (!siswa) {
//       return res.status(404).json({ message: 'Siswa tidak ditemukan' });
//     }

//     const userSiswa = await User.findByPk(siswa.user_id);
//     if (userSiswa) {
//       await userSiswa.destroy();
//     }

//     await siswa.destroy();

//     res.json({ message: 'Siswa & akun user berhasil dihapus' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// Hapus siswa + akun user siswa
exports.deleteSiswa = async (req, res) => {
  const { id } = req.params;

  try {
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    // DEBUG LOG
    console.log("Siswa ditemukan:", siswa);

    // Cari user berdasarkan user_id dan role
    const userSiswa = await User.findOne({
      where: { id: siswa.user_id, role: "siswa" },
    });

    // DEBUG LOG
    console.log("Akun user siswa:", userSiswa);

    if (userSiswa) {
      await userSiswa.destroy();
    }

    await siswa.destroy();

    res.json({ message: "Siswa & akun user berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error saat menghapus siswa:", err);
    res.status(500).json({ message: "Gagal menghapus siswa" });
  }
};

// Ambil siswa berdasarkan kelas (untuk guru)
exports.getSiswaByKelas = async (req, res) => {
  try {
    const { kelas_id } = req.query;

    if (!kelas_id) {
      return res.status(400).json({ message: "kelas_id wajib diisi" });
    }

    const siswa = await Siswa.findAll({
      where: { kelas_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
        {
          model: Kelas,
          as: "kelas",
          attributes: ["id", "nama_kelas"],
        },
      ],
    });

    res.json(siswa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
