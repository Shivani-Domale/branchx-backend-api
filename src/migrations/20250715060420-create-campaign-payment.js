'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CampaignPayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // 👈 Table name, not model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campaigns', // 👈 Table name, not model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      paymentId: {
        type: Sequelize.STRING
      },
      orderId: {
        type: Sequelize.STRING
      },
      receipt: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.ENUM('INR', 'USD')
      },
      status: {
        type: Sequelize.ENUM('CREATED', 'PAID', 'FAILED')
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
    await queryInterface.dropTable('CampaignPayments');
  }
};