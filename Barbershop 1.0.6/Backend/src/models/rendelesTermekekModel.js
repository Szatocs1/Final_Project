const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RendelesTermekek = sequelize.define('RendelesTermekek', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rendelesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rendelesek',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    termekId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'termekek',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    mennyiseg: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'rendelestermekek',
    timestamps: false,
  });

  return RendelesTermekek;
};
