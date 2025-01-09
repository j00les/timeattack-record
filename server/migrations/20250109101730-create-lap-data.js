'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LapData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      heatId: {
        type: Sequelize.INTEGER,
        references: { model: 'Heats', key: 'id' },
        onDelete: 'CASCADE'
      },
      racerId: {
        type: Sequelize.INTEGER,
        references: { model: 'Racers', key: 'id' },
        onDelete: 'CASCADE'
      },
      lapTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gapTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('LapData');
  }
};
