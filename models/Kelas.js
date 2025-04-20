const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Kelas = db.define('Kelas', {
  nama_kelas: {
    type: DataTypes.STRING,
    unique:true,
    allowNull: false
  },
  guru_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'kelas'
});

module.exports = Kelas;
