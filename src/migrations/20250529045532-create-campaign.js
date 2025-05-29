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
      campaignDescription: {
        type: Sequelize.TEXT
      },
      campaignObjective: {
        type: Sequelize.STRING
      },
      campaignType: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      demographic: {
        type: Sequelize.STRING
      },
      timeSlot: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.BIGINT
      },
      interval: {
        type: Sequelize.INTEGER
      },
      baseBid: {
        type: Sequelize.INTEGER
      },
      budgetLimit: {
        type: Sequelize.INTEGER
      },
      estimatedReach: {
        type: Sequelize.INTEGER
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      targetRegions: {
        type: Sequelize.STRING
      },
      cities: {
        type: Sequelize.STRING
      },
      ageGroups: {
        type: Sequelize.STRING
      },
      selectedDays: {
        type: Sequelize.STRING
      },
      creativeUrl: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
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