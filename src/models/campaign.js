'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // import UUID
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
      Campaign.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Campaign.belongsToMany(models.Device, {
        through: 'CampaignDeviceTypes',
        foreignKey: 'campaignId',
        otherKey: 'deviceTypeId',
        as: 'devices'
      });
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
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
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
    campaignCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
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
    isPayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Campaign',
    paranoid: true,
    hooks: {
      beforeCreate: async (campaign, options) => {
        if (campaign.campaignName) {
          const name = campaign.campaignName.replace(/\s+/g, '');
          const first2 = name.substring(0, 2).toUpperCase();
          const random4 = uuidv4().replace(/-/g, '').substring(0, 4).toUpperCase();
          campaign.campaignCode = `${first2}${random4}`;
        }
      }
    }
  });
  return Campaign;
};



