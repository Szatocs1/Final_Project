const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(255),
      primaryKey: true,
      autoIncrement: true,
    },
    nev: {
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    jelszo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    telefonszam: {
      type: DataTypes.STRING(12)
    },
    foglaltsag: {
      type: DataTypes.ENUM('Fogyasztó', 'Borbély', 'Admin'),
      allowNull: false,
      defaultValue: 'Fogyasztó',
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
