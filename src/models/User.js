const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {  // Definir manualmente la columna created_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {  // Definir manualmente la columna updated_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users', // Para mantener el nombre de la tabla en minúsculas
  timestamps: false,  // Desactivamos los timestamps predeterminados
});

module.exports = User;