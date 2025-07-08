const { Campaign, Location, Device, Product, Sequelize } = require('../models');
const crudRepository = require('./crud-repository');

class CampaignRepository extends crudRepository {
  constructor() {
    super(Campaign);
  }

  async findByIdWithLocationAndDevice(campaignId) {
    return await Campaign.findOne({
      where: { id: campaignId },
      include: [
        {
          model: Location,
          attributes: ['city'],
          as: 'locations',           // Only return city
          through: { attributes: [] },
        },
        {
          model: Device,
          attributes: ['deviceName'],
          as: 'devices',     // Only return deviceType
          through: { attributes: [] },
        },
        {
          model: Product,
          as: 'product', // Assuming the association is named 'products'
          attributes: ['product_type']    // Only return product_type
        }
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId', 'userId', 'remark', 'isDeleted', 'isDraft'] // Optional: exclude timestamps from Campaign itself
      }
    });
  }




  async deleteById(campaignId, transaction) {
    const campaign = await Campaign.findOne({
      where: { id: campaignId, isDeleted: false },
      transaction
    });

    if (!campaign) {
      throw new Error('Campaign not found or already deleted');
    }

    await campaign.setDevices([], { transaction });
    await campaign.setLocations([], { transaction });

    await campaign.update(
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { transaction }
    );

    return { message: 'Campaign marked as deleted (soft delete).' };
  }

  async findByUserId(userId) {
    return await this.model.findAll({
      where: {
        userId: userId,
        isDeleted: false
      },
      include: [
        {
          association: 'devices', // from Campaign model `as: 'devices'`
          attributes: ['deviceName']
        },
        {
          association: 'locations', // from Campaign model `as: 'locations'`
          attributes: ['city']
        },
        {
          association: 'product', // from Campaign model `as: 'product'`
          attributes: ['product_type']
        }
      ]
    });
  }

  async findAllApproved() {
    return await this.model.findAll({
      where: {
        isApproved: 'APPROVED',  // Filter only approved campaigns
        isDeleted: false   // Optional: ignore soft-deleted ones
      },
      include: [{
        model: Device,
        as: 'devices',
       attributes: ['deviceName']
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'productId', 'userId', 'remark', 'isDeleted', 'isDraft']
      }
    });
  }


}

module.exports = CampaignRepository;
