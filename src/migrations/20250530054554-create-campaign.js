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
      adDeviceShow: {
        type: Sequelize.STRING
      },
      ageGroups: {
        type: Sequelize.STRING
      },
      baseBid: {
        type: Sequelize.INTEGER
      },
      budgetLimit: {
        type: Sequelize.INTEGER
      },
      campaignName: {
        type: Sequelize.STRING
      },
      campaignDescription: {
        type: Sequelize.STRING
      },
      campaignObjective: {
        type: Sequelize.STRING
      },
      campaignType: {
        type: Sequelize.STRING
      },
      creativeFile: {
        type: Sequelize.STRING
      },
      creativeType: {
        type: Sequelize.STRING
      },
      demographic: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      interval: {
        type: Sequelize.INTEGER
      },
      maxBidCap: {
        type: Sequelize.INTEGER
      },
      scheduleDate: {
        type: Sequelize.STRING
      },
      scheduleEndDate: {
        type: Sequelize.STRING
      },
      selectedDays: {
        type: Sequelize.STRING
      },
      slopePreference: {
        type: Sequelize.STRING
      },
      targetRegions: {
        type: Sequelize.STRING
      },
      timeSlot: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
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