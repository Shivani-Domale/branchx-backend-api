const { CampaignRepository } = require("../repositories");

const campaignRepository = new CampaignRepository();

const createCampaign = async(data)=> {
     //  console.log("Creating campaign with data:", data);
  try
    {
        const response = await campaignRepository.create(data);
        return response;
    }catch (error) {
        throw new Error(`Error creating campaign: ${error.message}`);
    }
}

module.exports = {
    createCampaign
}