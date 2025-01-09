'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RaceEvent extends Model {
    static associate(models) {
      RaceEvent.hasMany(models.RaceRun, {
        foreignKey: 'raceEventId',
        as: 'raceRuns'
      });
    }
  }

  RaceEvent.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    { sequelize, modelName: 'RaceEvent' }
  );

  return RaceEvent;
};
