const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();

// Atur CORS agar menerima request dari frontend Vercel
// ✅ Izinkan dua origin sekaligus
const allowedOrigins = [
  'http://localhost:5173',
  'https://absenkuy-bay.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API ABSENSI BERJALAN 🚀');
});

// Load routes
const authRoutes = require('./routes/authRoutes');
const guruRoutes = require('./routes/guruRoutes');
const kelasRoutes = require('./routes/kelasRoutes');
const siswaRoutes = require('./routes/siswaRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const laporanRoutes = require('./routes/laporanRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/kelas', kelasRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/laporan', laporanRoutes);

// Load all models and their relations
require('./models');

// Tes koneksi DB
db.authenticate()
  .then(() => console.log('✅ Database connected...'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// Sync models ke DB
db.sync({})
  .then(() => console.log('✅ Semua tabel berhasil disinkronkan!'))
  .catch(err => console.error('❌ Sync error:', err));

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
