const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Absensi = db.define('Absensi', {
  siswa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kelas_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alpa'),
    allowNull: false
  }
}, {
  tableName: 'absensi'
});

module.exports = Absensi;
