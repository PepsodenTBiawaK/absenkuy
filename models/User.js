// models/User.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'guru', 'siswa'),
    allowNull: false
  }
 
},
{
  tableName: 'users'
});

module.exports = User;
