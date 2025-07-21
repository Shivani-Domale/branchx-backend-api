'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Campaigns', 'campaignCode', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true // <- add this
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Campaigns', 'campaignCode');
  }
};
