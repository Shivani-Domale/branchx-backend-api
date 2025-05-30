const {Logger} = require("../../config");
const { CampaignRepository } = require("../../repositories");
const { uploadFileToS3 } = require("../../utils/s3Uploader");

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
        campaign.creativeFile = url;
        campaign.status = 0;

        campaign.ageGroups = Array.isArray(data.ageGroups)
        ?data.ageGroups.join(",")
        :data.ageGroups;

        campaign.selectedDays = Array.isArray(data.selectedDays)
        ?data.selectedDays.join(",")
        :data.selectedDays;

        campaign.targetRegions = Array.isArray(data.targetRegions)
        ?data.targetRegions.join(",")   
        :data.targetRegions;

        await campaign.save();

        return campaign;
    }catch (error) {
        throw new Error(`Error creating campaign: ${error.message}`);
    }
}

const getAllCampaigns = async() => {    
    
    try {
        const campaigns = await campaignRepository.findAll();
        return campaigns;
    } catch (error) {
        throw new Error(`Error fetching campaigns: ${error.message}`);
    }
}   

module.exports = {
    createCampaign,getAllCampaigns
}