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
  const campaign = await Campaign.findByPk(campaignId, { transaction });

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  // Clear many-to-many relationships
  await campaign.setDevices([], { transaction });
  await campaign.setLocations([], { transaction });

  // Delete the campaign itself
  await Campaign.destroy({
    where: { id: campaignId },
    transaction
  });

  return { id: campaignId, message: 'Campaign permanently deleted' };
}

}

module.exports = CampaignRepository;
