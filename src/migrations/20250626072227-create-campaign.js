'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Campaigns', 'startDate', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('Campaigns', 'endDate', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('Campaigns', 'startTime', {
        type: Sequelize.TIME
      }),
      queryInterface.addColumn('Campaigns', 'endTime', {
        type: Sequelize.TIME
      }),

      queryInterface.addColumn('Campaigns', 'campaignBudget', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Campaigns', 'adType', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Campaigns', 'storeType', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Campaigns', 'productFiles', {
        type: Sequelize.JSON
      }),

      queryInterface.addColumn('Campaigns', 'isDeleted', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),

      queryInterface.addColumn('Campaigns', 'deletedAt', {
        type: Sequelize.DATE,
        defaultValue: null
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Campaigns', 'startDate'),
      queryInterface.removeColumn('Campaigns', 'endDate'),
      queryInterface.removeColumn('Campaigns', 'startTime'),
      queryInterface.removeColumn('Campaigns', 'endTime'),
      queryInterface.removeColumn('Campaigns', 'campaignBudget'),
      queryInterface.removeColumn('Campaigns', 'adType'),
      queryInterface.removeColumn('Campaigns', 'storeType'),
      queryInterface.removeColumn('Campaigns', 'productFiles'),
      queryInterface.removeColumn('Campaigns', 'isDeleted'),
      queryInterface.removeColumn('Campaigns', 'deletedAt')
    ]);
  }
};
