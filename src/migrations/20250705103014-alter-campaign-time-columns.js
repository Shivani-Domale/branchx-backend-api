module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Campaigns', 'startTime', {
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Campaigns', 'endTime', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Campaigns', 'startTime', {
      type: Sequelize.TIME
    });
    await queryInterface.changeColumn('Campaigns', 'endTime', {
      type: Sequelize.TIME
    });
  }
};
