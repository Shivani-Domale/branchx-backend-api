// migrations/xxxx-add-reset-otp-fields-to-user.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'resetOtp', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'resetOtpExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'resetOtp');
    await queryInterface.removeColumn('Users', 'resetOtpExpires');
  }
};
