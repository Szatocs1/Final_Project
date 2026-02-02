const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const rendelesek = sequelize.define('rendelesek', {
            id: {
                type: DataTypes.INTEGER(255),
                primaryKey: true,
                autoIncrement: true,
            },
            vasarloNeve: {
                type: DataTypes.STRING(75),
                allowNull: false,
            },
            vasarloEmail: {
                type: DataTypes.STRING(75),
                allowNull: false,
            },
            telefonszam: {
                type: DataTypes.STRING(12),
                allowNull: false,
            },
            iranyitoszam: {
                type: DataTypes.INTEGER(4),
                allowNull: false,
            },
            telepules: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            szallitasiCim: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            rendelesIdeje: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            termekek: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            ar: {
                type: DataTypes.INTEGER(255),
                allowNull: false,
            },
  }, {
    tableName: 'rendelesek',
    timestamps: false,
  });

  return rendelesek;
};
