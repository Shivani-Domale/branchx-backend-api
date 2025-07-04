'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Devices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      deviceName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resolutionHeight: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resolutionWidth: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      orientation: {
        type: Sequelize.ENUM('Horizontal', 'Vertical'),
        allowNull: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Devices');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Devices_orientation";');
  }
};
