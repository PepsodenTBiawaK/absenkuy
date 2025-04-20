const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Siswa = db.define('Siswa', {
  nama_siswa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nisn: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  kelas_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'siswa',
  timestamps: true
});

module.exports = Siswa;
