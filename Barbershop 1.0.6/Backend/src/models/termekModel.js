const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const termekek = sequelize.define('termekek', {
            id: {
                type: DataTypes.INTEGER(255),
                primaryKey: true,
                autoIncrement: true,
            },
            termekNev: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            kepNeve: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            kategoria: {
                type:DataTypes.STRING(255),
                allowNull: false,
            },
            ar: {
                type: DataTypes.INTEGER(255),
                allowNull: false,
            },
            megjegyzes: {
                type: DataTypes.STRING(255),
                allowNull: true,
            }
  }, {
    tableName: 'termekek',
    timestamps: false,
  });

  return termekek;
};
