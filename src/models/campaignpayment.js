'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CampaignPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CampaignPayment.belongsTo(models.User,{foreignKey:'userId'})
      CampaignPayment.belongsTo(models.Campaign,{foreignKey:'campaignId'})
    }
  }
  CampaignPayment.init({
    userId: DataTypes.INTEGER,
    campaignId: DataTypes.INTEGER,
    paymentId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    receipt: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    currency: DataTypes.ENUM('INR', 'USD'),
    status: DataTypes.ENUM('CREATED', 'PAID', 'FAILED')
  }, {
    sequelize,
    modelName: 'CampaignPayment',
  });
  return CampaignPayment;
};