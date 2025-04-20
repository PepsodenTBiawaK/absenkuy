const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import model User
const db = require('../config/db');     // Import koneksi DB

async function seedAdmin() {
  try {
    await db.sync(); // sync db supaya gak error tabel

    // Cek apakah admin sudah ada (biar gak double)
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('❗ Admin sudah ada:', existingAdmin.email);
      process.exit();
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash('Password@dmintanyaFadil_', 10);

    // Buat akun admin
    const admin = await User.create({
      name: 'Admin Utama',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin berhasil dibuat:', admin.email);
  } catch (error) {
    console.error('❌ Error saat membuat admin:', error);
  } finally {
    process.exit(); // Keluar dari proses Node
  }
}

seedAdmin();
