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
      Campaign.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Campaign.init({
    adDeviceShow: DataTypes.STRING,
    ageGroups: DataTypes.STRING,
    baseBid: DataTypes.INTEGER,
    budgetLimit: DataTypes.INTEGER,
    campaignName: DataTypes.STRING,
    campaignDescription: DataTypes.STRING,
    campaignObjective: DataTypes.STRING,
    campaignType: DataTypes.STRING,
    creativeFile: DataTypes.STRING,
    creativeType: DataTypes.STRING,
    demographic: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    interval: DataTypes.INTEGER,
    maxBidCap: DataTypes.INTEGER,
    scheduleDate: DataTypes.STRING,
    scheduleEndDate: DataTypes.STRING,
    selectedDays: DataTypes.STRING,
    slopePreference: DataTypes.STRING,
    targetRegions: DataTypes.STRING,
    timeSlot: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    isApproved: DataTypes.STRING,
    isPayment: DataTypes.BOOLEAN,
    userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', 
      key: 'id'
    },
    onDelete: 'CASCADE' 
  }
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};