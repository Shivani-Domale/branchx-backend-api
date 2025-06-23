'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.renameColumn('Campaigns', 'budgetLimit', 'estimatedPrice');
      await queryInterface.addColumn('Campaigns', 'isDraft', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Campaigns', 'estimatedPrice', 'budgetLimit');
   
  }
};
