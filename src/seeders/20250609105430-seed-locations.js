'use strict';

const locations = require('../utils/csvjson.json'); // adjust the path

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add timestamps if your model/table expects them
    const timestamp = new Date();
    locations.forEach(location => {
      location.createdAt = timestamp;
      location.updatedAt = timestamp;
    });

    await queryInterface.bulkInsert('Locations', locations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locations', null, {});
  }
};
