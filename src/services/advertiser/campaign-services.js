const { Logger } = require("../../config");
const { CampaignRepository } = require("../../repositories");
const { uploadFileToS3 } = require("../../utils/s3Uploader");
const { Op } = require("sequelize");

const campaignRepository = new CampaignRepository();

const createCampaign = async (data, fileBuffer, originalName) => {
  try {
    const campaign = await campaignRepository.create(data);

    if (!campaign) {
      throw new Error("Campaign creation failed");
    }

    const url = await uploadFileToS3(fileBuffer, originalName, campaign.id);
    Logger.info(`File uploaded successfully: ${url}`);

    campaign.creativeFile = url;
    campaign.status = false;
    campaign.isApproved = "PENDING";
    campaign.isPayment = false;

    campaign.ageGroups = Array.isArray(data.ageGroups)
      ? data.ageGroups.join(",")
      : data.ageGroups;
  
    campaign.selectedDays = Array.isArray(data.selectedDays)
      ? data.selectedDays.join(",")
      : data.selectedDays;

    campaign.targetRegions = Array.isArray(data.targetRegions)
      ? data.targetRegions.join(",")
      : data.targetRegions;
    await campaign.save();

    return campaign;
  } catch (error) {
    throw new Error(`Error creating campaign: ${error.message}`);
  }
};


const getAllCampaigns = async () => {
    try {
  
        const campaigns = await campaignRepository.findAll({
            where:{
                isApproved:{
                [Op.ne]:'PENDING'
                }
            }
    });
    
        const data = [];

        campaigns.forEach(campaign => {
            // Convert string to Date object
            const date = new Date(campaign.scheduleDate);

            // Format in IST
            const formattedDate = date.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });

            data.push({
                id: campaign.id,
                campaignName: campaign.campaignName,
                scheduleDate: formattedDate, // formatted in IST
                timeSlot: campaign.timeSlot,
                campaignObjective: campaign.campaignObjective,
                creativeFile: campaign.creativeFile,
                status: campaign.status,
                isApproved: campaign.isApproved,
                isPayment: campaign.isPayment
            });
        });


        return data;
    } catch (error) {
        throw new Error(`Error fetching campaigns: ${error.message}`);
    }
};


const updateCampaignStatus = async (id, status) => {
    try {
        const campaign = await campaignRepository.findById(id);

        if (!campaign) {
            throw new Error("Campaign not found");
        }

        if (status === true) {
            campaign.status = true;
        } else if (status === false) {
            campaign.status = false;
        }

        
        await campaign.save();
        return campaign;

    } catch (error) {
        throw new Error(`Error updating campaign status: ${error.message}`);
    }

}

module.exports = {
    createCampaign, getAllCampaigns, updateCampaignStatus
}