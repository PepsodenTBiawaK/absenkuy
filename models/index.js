const User = require('./User');
const Kelas = require('./Kelas');
const Siswa = require('./Siswa');
const Absensi = require('./Absensi');

// User ↔ Kelas (Guru mengampu banyak kelas)
User.hasMany(Kelas, { foreignKey: 'guru_id', as: 'kelas' });
Kelas.belongsTo(User, { foreignKey: 'guru_id', as: 'guru' });

// User ↔ Siswa (User siswa punya 1 akun)
User.hasMany(Siswa, { foreignKey: 'user_id', as: 'siswa' });
Siswa.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Kelas ↔ Siswa
Kelas.hasMany(Siswa, { foreignKey: 'kelas_id', as: 'siswa' });
Siswa.belongsTo(Kelas, { foreignKey: 'kelas_id', as: 'kelas' });

// Kelas ↔ Absensi
Kelas.hasMany(Absensi, { foreignKey: 'kelas_id', as: 'absensi' });
Absensi.belongsTo(Kelas, { foreignKey: 'kelas_id', as: 'kelas' });

// Siswa ↔ Absensi
Siswa.hasMany(Absensi, { foreignKey: 'siswa_id', as: 'absensi' });
Absensi.belongsTo(Siswa, { foreignKey: 'siswa_id', as: 'siswa' });

module.exports = { User, Kelas, Siswa, Absensi };
