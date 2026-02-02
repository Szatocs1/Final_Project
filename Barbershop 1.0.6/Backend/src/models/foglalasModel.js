const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const foglalasok = sequelize.define('foglalasok', {
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
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            vasarloTelefonszam: {
                type: DataTypes.STRING(12),
                allowNull: false,
            },
            idopont:{
                type: DataTypes.DATE,
                allowNull: false,
            },
            borbely: {
                type: DataTypes.STRING(75),
                allowNull: false,
            },
            szolgaltatas: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
  }, {
    tableName: 'foglalasok',
    timestamps: false,
  });

  return foglalasok;
};
