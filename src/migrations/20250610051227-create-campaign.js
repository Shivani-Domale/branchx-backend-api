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
      timeSlot: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      isApproved: {
        type: Sequelize.STRING
      },
      isPayment: {
        type: Sequelize.BOOLEAN
      },
      baseBid: {
        type: Sequelize.INTEGER
      },
      budgetLimit: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Must match actual table name in DB (case-sensitive on some DBs)
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      productId: {
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