'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LapData extends Model {
    static associate(models) {
      LapData.belongsTo(models.Heat, {
        foreignKey: 'heatId',
        as: 'heat'
      });

      LapData.belongsTo(models.Racer, {
        foreignKey: 'racerId',
        as: 'racer'
      });
    }
  }

  LapData.init(
    {
      heatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Heats',
          key: 'id'
        }
      },
      racerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Racers',
          key: 'id'
        }
      },
      lapTime: {
        type: DataTypes.STRING,
        allowNull: false
      },

      gapTime: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { sequelize, modelName: 'LapData' }
  );

  return LapData;
};
