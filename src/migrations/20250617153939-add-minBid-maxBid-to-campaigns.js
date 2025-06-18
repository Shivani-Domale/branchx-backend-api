'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add maxBid column
    await queryInterface.addColumn('Campaigns', 'maxBid', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

 await queryInterface.addColumn('Campaigns', 'scheduleStartDate', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Add minBid column
    await queryInterface.addColumn('Campaigns', 'minBid', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove maxBid column
    await queryInterface.removeColumn('Campaigns', 'maxBid');

    // Remove minBid column
    await queryInterface.removeColumn('Campaigns', 'minBid');
  }
};
