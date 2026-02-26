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
            ar: {
                type: DataTypes.INTEGER(255),
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            borbelyId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            }
  }, {
    tableName: 'foglalasok',
    timestamps: false,
  });

  return foglalasok;
};
