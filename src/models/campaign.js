'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      // Belongs to one Product
      Campaign.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });

      // Belongs to one User
      Campaign.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Belongs to many Devices
      Campaign.belongsToMany(models.Device, {
        through: 'CampaignDeviceTypes',
        foreignKey: 'campaignId',
        otherKey: 'deviceTypeId',
        as: 'devices'
      });

      // Belongs to many Locations
      Campaign.belongsToMany(models.Location, {
        through: 'CampaignLocations',
        foreignKey: 'campaignId',
        otherKey: 'locationId',
        as: 'locations'
      });
    }
  }

  Campaign.init({
    campaignName: DataTypes.STRING,
    brandName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    baseBid: DataTypes.INTEGER,
    maxBid: DataTypes.STRING,
    campaignBudget: DataTypes.STRING,
    adType: DataTypes.STRING,
    storeType: DataTypes.STRING,
    productFiles: DataTypes.JSON,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isApproved: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Campaign',
    paranoid: true // Sequelize uses deletedAt for soft deletes
  });

  return Campaign;
};
