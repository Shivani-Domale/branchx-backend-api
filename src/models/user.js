'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Campaign, { foreignKey: 'userId' });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    role: DataTypes.STRING,
    businessName: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
    },
    password: DataTypes.STRING,
    // :white_check_mark: Fields for OTP-based password reset
    resetOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};