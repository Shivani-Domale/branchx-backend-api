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
}

module.exports = CampaignRepository;
