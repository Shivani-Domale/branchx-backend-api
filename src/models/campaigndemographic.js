'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignDemographic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CampaignDemographic.belongsTo(models.Campaign, {
        foreignKey: 'campaignId',
        as: 'campaign'
      });
    }
    }
  
  CampaignDemographic.init({
    campaignId: DataTypes.INTEGER,
    ageRange: DataTypes.STRING,
    buyers: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CampaignDemographic',
  });
  return CampaignDemographic;
};