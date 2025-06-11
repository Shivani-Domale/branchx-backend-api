'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CampaignLocations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaignId: {
        type: Sequelize.INTEGER,
        references: { model: 'Campaigns', key: 'id' },
        onDelete: 'CASCADE'
      },
      locationId: {
        type: Sequelize.INTEGER,
        references: { model: 'Locations', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CampaignLocations');
  }
};
