const jwt = require('jsonwebtoken');

// Middleware cek token
exports.verifyToken = (req, res, next) => {
  const bearer = req.headers['authorization'];
  const token = bearer && bearer.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId + role
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

// Middleware cek role admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses hanya untuk Admin' });
  }
  next();
};

// Middleware cek role guru
exports.isGuru = (req, res, next) => {
  if (req.user.role !== 'guru') {
    return res.status(403).json({ message: 'Akses hanya untuk Guru' });
  }
  next();
};

// Middleware cek role siswa
exports.isSiswa = (req, res, next) => {
  if (req.user.role !== 'siswa') {
    return res.status(403).json({ message: 'Akses hanya untuk siswa' });
  }
  next();
};
