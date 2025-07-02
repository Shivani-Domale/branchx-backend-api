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
      campaignCode: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      startTime: {
        type: Sequelize.TIME
      },
      endTime: {
        type: Sequelize.TIME
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      baseBid: {
        type: Sequelize.INTEGER
      },
      maxBid: {
        type: Sequelize.INTEGER
      },
      campaignBudget: {
        type: Sequelize.STRING
      },
      adType: {
        type: Sequelize.STRING
      },
      storeType: {
        type: Sequelize.STRING
      },
      productFiles: {
        type: Sequelize.JSON
      },
      userId: {
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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