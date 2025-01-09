'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RaceRun extends Model {
    static associate(models) {
      RaceRun.belongsTo(models.RaceEvent, {
        foreignKey: 'raceEventId',
        as: 'raceEvent'
      });

      RaceRun.hasMany(models.Heat, {
        foreignKey: 'raceRunId',
        as: 'heats'
      });
    }
  }

  RaceRun.init(
    {
      raceEventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'RaceEvents',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { sequelize, modelName: 'RaceRun' }
  );

  return RaceRun;
};
