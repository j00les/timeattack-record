'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Racer extends Model {
    static associate(models) {
      Racer.hasMany(models.LapData, {
        foreignKey: 'racerId',
        as: 'lapData'
      });
    }
  }

  Racer.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      carName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      carType: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { sequelize, modelName: 'Racer' }
  );

  return Racer;
};
