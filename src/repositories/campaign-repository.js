const { Campaign, Location, Device, Product } = require('../models');
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
        attributes: ['city'],           // Only return city
        through: { attributes: [] },
      },
      {
        model: Device,
        attributes: ['deviceType'],     // Only return deviceType
        through: { attributes: [] },
      },
      {
        model: Product,
        attributes: ['product_type']    // Only return product_type
      }
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','productId','userId','remark','isDeleted','isDraft'] // Optional: exclude timestamps from Campaign itself
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
      }
    });
  }

}

module.exports = CampaignRepository;
