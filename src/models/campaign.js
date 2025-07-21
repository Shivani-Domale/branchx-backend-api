'use strict';
const { Model } = require('sequelize');
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
          const first3 = name.substring(0, 3).toUpperCase();
          const last3 = name.substring(name.length - 3).toUpperCase();
          const prefix = `${first3}${last3}`;

          const latestCampaign = await Campaign.findOne({
            where: {
              campaignCode: {
                [Op.like]: `${prefix}%`
              }
            },
            paranoid: false,
            order: [['createdAt', 'DESC']]
          });

          let nextNumber = '001';
          if (latestCampaign && latestCampaign.campaignCode) {
            const lastNumStr = latestCampaign.campaignCode.slice(prefix.length);
            const lastNum = parseInt(lastNumStr);
            nextNumber = String(lastNum + 1).padStart(3, '0');
          }

          campaign.campaignCode = `${prefix}${nextNumber}`;
        }
      }
    }
  });

  return Campaign;
};
