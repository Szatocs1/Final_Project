const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const kepek = sequelize.define('kepek', {
            id: {
                type: DataTypes.INTEGER(255),
                primaryKey: true,
                autoIncrement: true,
            },
            imgName: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            imgPath: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            imgMIME:{
                type: DataTypes.STRING(255),
                allowNull: false,
            }
  }, {
    tableName: 'kepek',
    timestamps: false,
  });

  return kepek;
};
