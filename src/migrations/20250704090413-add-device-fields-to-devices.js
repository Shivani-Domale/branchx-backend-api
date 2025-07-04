'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Devices', 'deviceName', {
      type: Sequelize.STRING,
      allowNull: false // Optional: only if table has existing data
    });

    await queryInterface.addColumn('Devices', 'resolutionHeight', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1080 // Optional default
    });

    await queryInterface.addColumn('Devices', 'resolutionWidth', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1920 // Optional default
    });

    await queryInterface.addColumn('Devices', 'orientation', {
      type: Sequelize.ENUM('Horizontal', 'Vertical'),
      allowNull: false // Optional default
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Devices', 'deviceName');
    await queryInterface.removeColumn('Devices', 'deviceType');
    await queryInterface.removeColumn('Devices', 'resolutionHeight');
    await queryInterface.removeColumn('Devices', 'resolutionWidth');
    await queryInterface.removeColumn('Devices', 'orientation');

    // Drop enum type if needed (Postgres)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Devices_orientation";');
  }
};
