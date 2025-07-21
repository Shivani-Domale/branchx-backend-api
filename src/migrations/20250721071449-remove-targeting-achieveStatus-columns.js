'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Campaigns', 'targeting');
    await queryInterface.removeColumn('Campaigns', 'achieveStatus');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Campaigns', 'targeting', {
      type: Sequelize.STRING,
      defaultValue: '5000 Clicks'
    });
    await queryInterface.addColumn('Campaigns', 'achieveStatus', {
      type: Sequelize.STRING,
      defaultValue: '45% Achieved'
    });
  }
};
