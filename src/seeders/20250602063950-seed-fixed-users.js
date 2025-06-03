'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 10);

    return queryInterface.bulkInsert('Accounts', [
      {
        fullName: 'Advertiser User',
        email: 'advertiser@example.com',
        password: password,
        role: 'advertiser',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: 'Retailer User',
        email: 'retailer@example.com',
        password: password,
        role: 'retailer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: 'Distributor User',
        email: 'distributor@example.com',
        password: password,
        role: 'distributor',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Accounts', {
      email: [
        'advertiser@example.com',
        'retailer@example.com',
        'distributor@example.com'
      ]
    }, {});
  }
};
