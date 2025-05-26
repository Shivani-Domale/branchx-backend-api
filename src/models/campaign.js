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
      Campaign.belongsTo(models.CampaignType, {
        foreignKey: 'campaignTypeId',
        as: 'campaignType'
      });
      Campaign.belongsTo(models.StoreType, {
        foreignKey: 'storeTypeId',
        as: 'storeType'
      });
      Campaign.belongsTo(models.Region, {
        foreignKey: 'targetRegionId',
        as: 'targetRegion'
      });
     
      Campaign.belongsTo(models.TimeSlot, {
        foreignKey: 'timeSlotId',
        as: 'timeSlot'
      });
    }
  }
  Campaign.init({
    campaignName: DataTypes.STRING,
    campaignTypeId: DataTypes.INTEGER,
    storeTypeId: DataTypes.INTEGER,
    targetRegionId: DataTypes.INTEGER,
    timeSlotId: DataTypes.INTEGER,
    startDate: DataTypes.BIGINT,
    endDate: DataTypes.BIGINT,
    bidPerSecond: DataTypes.INTEGER,
    estimatedDevices: DataTypes.INTEGER,
    creativeUrl: DataTypes.STRING,
    paymentMode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Campaign',
  });
  return Campaign;
};