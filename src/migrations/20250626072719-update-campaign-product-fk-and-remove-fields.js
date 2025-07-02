'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Campaigns', 'campaignObjective'),
      queryInterface.removeColumn('Campaigns', 'campaignType'),
      queryInterface.removeColumn('Campaigns', 'creativeFile'),
      queryInterface.removeColumn('Campaigns', 'demographic'),
      queryInterface.removeColumn('Campaigns', 'interval'),
      queryInterface.removeColumn('Campaigns', 'isDraft'),
      queryInterface.removeColumn('Campaigns', 'timeSlot'),
      queryInterface.removeColumn('Campaigns', 'estimatedPrice'),
      queryInterface.removeColumn('Campaigns', 'minBid'),
    ]);
    await Promise.all([
      queryInterface.addColumn('Campaigns', 'storeType', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Campaigns', 'adType', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Optional: Add back removed columns if needed
    await Promise.all([

      queryInterface.addColumn('Campaigns', 'campaignObjective', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'creativeFile', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'creativeType', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'demographic', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'interval', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'timeSlot', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'minBid', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'estimatedPrice', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'isDraft', { type: Sequelize.BOOLEAN, defaultValue: false }),

    ]);
  }
};
