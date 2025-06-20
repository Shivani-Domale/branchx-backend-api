const { Campaign, Location, Device } = require('../models');
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
          through: { attributes: [] }, // Exclude junction table fields
        },
        {
          model: Device,
          through: { attributes: [] }, // Exclude junction table fields
        }
      ]
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


}

module.exports = CampaignRepository;
