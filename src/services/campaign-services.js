const { Logger } = require("../config");
const { CampaignRepository } = require("../repositories");
const { uploadFileToS3 } = require("../utils/s3Uploader");

const campaignRepository = new CampaignRepository();

const createCampaign = async(data,fileBuffer,originalName)=> {
     //  console.log("Creating campaign with data:", data);
  try
    {
        const campaign = await campaignRepository.create(data);

        if (!campaign) {
            throw new Error("Campaign creation failed");
        }

        const url = await uploadFileToS3(fileBuffer, originalName, campaign.id); 
        Logger.info(`File uploaded successfully: ${url}`);
        campaign.creativeUrl = url;

        await campaign.save();

        return campaign;
    }catch (error) {
        throw new Error(`Error creating campaign: ${error.message}`);
    }
}

module.exports = {
    createCampaign
}