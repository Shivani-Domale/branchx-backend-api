'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Campaign.init({
    campaignName: DataTypes.STRING,
    campaignDescription: DataTypes.TEXT,
    campaignObjective: DataTypes.STRING,
    campaignType: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    demographic: DataTypes.STRING,
    timeSlot: DataTypes.STRING,
    date: DataTypes.BIGINT,
    interval: DataTypes.INTEGER,
    baseBid: DataTypes.INTEGER,
    budgetLimit: DataTypes.INTEGER,
    estimatedReach: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    targetRegions: DataTypes.STRING,
    cities: DataTypes.STRING,
    ageGroups: DataTypes.STRING,
    selectedDays: DataTypes.STRING,
    creativeUrl: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};