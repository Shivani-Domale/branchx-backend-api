'use strict';

const products = require('../utils/product.json'); // Adjust path if needed

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();
    products.forEach(product => {
      product.createdAt = timestamp;
      product.updatedAt = timestamp;
    });

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
