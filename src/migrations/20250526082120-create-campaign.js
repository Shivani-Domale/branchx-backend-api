'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaignName: {
        type: Sequelize.STRING
      },
      campaignTypeId: {
        type: Sequelize.INTEGER
      },
      storeTypeId: {
        type: Sequelize.INTEGER
      },
      targetRegionId: {
        type: Sequelize.INTEGER
      },
      timeSlotId: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.BIGINT
      },
      endDate: {
        type: Sequelize.BIGINT
      },
      bidPerSecond: {
        type: Sequelize.INTEGER
      },
      estimatedDevices: {
        type: Sequelize.INTEGER
      },
      creativeUrl: {
        type: Sequelize.STRING
      },
      paymentMode: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns');
  }
};