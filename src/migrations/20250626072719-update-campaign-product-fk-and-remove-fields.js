'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Campaigns', 'campaignType'),
      queryInterface.removeColumn('Campaigns', 'creativeType'),
      queryInterface.removeColumn('Campaigns', 'creativeFile'),
      queryInterface.removeColumn('Campaigns', 'demographic'),
      queryInterface.removeColumn('Campaigns', 'interval'),
      queryInterface.removeColumn('Campaigns', 'isDraft'),
      queryInterface.removeColumn('Campaigns', 'timeSlot'),
      queryInterface.removeColumn('Campaigns', 'estimatedPrice'),
      queryInterface.removeColumn('Campaigns', 'minBid'),
      queryInterface.removeColumn('Campaigns', 'campaignDescription'),
      queryInterface.removeColumn('Campaigns', 'campaignObjective'), 
      queryInterface.removeColumn('Campaigns', 'scheduleDate'),
      queryInterface.removeColumn('Campaigns', 'scheduleEndDate'),
      queryInterface.removeColumn('Campaigns', 'scheduleStartDate'),
      queryInterface.removeColumn('Campaigns', 'selectedDays'),
      queryInterface.removeColumn('Campaigns', 'campaignCode'),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Campaigns', 'storeType'),
      queryInterface.removeColumn('Campaigns', 'adType')
    ]);

    await Promise.all([
      queryInterface.addColumn('Campaigns', 'campaignType', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'creativeType', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'creativeFile', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'demographic', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'interval', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'isDraft', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn('Campaigns', 'timeSlot', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'estimatedPrice', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'minBid', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'campaignDescription', { type: Sequelize.TEXT }),
      queryInterface.addColumn('Campaigns', 'campaignObjective', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'scheduleDate', { type: Sequelize.DATE }),
      queryInterface.addColumn('Campaigns', 'scheduleEndDate', { type: Sequelize.DATE }),
      queryInterface.addColumn('Campaigns', 'scheduleStartDate', { type: Sequelize.DATE }),
      queryInterface.addColumn('Campaigns', 'selectedDays', { type: Sequelize.STRING }),
      queryInterface.addColumn('Campaigns', 'campaignCode', { type: Sequelize.STRING }),
    ]);
  }
};
