'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Heat extends Model {
    static associate(models) {
      Heat.belongsTo(models.RaceRun, {
        foreignKey: 'raceRunId',
        as: 'raceRun'
      });

      Heat.hasMany(models.LapData, {
        foreignKey: 'heatId',
        as: 'lapData'
      });
    }
  }

  Heat.init(
    {
      raceRunId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'RaceRuns',
          key: 'id'
        }
      },
      heatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { sequelize, modelName: 'Heat' }
  );

  return Heat;
};
