'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Devices', 'status', {
      type: Sequelize.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'enabled'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Devices', 'status');
  }
};
