const { Logger } = require("../../config");
const { CampaignRepository } = require("../../repositories");
const { ParseArrayToString } = require("../../utils");
const { uploadFileToS3 } = require("../../utils/s3Uploader");
const { Op } = require("sequelize");

const campaignRepository = new CampaignRepository();

const createCampaign = async (data, fileBuffer, originalName, id) => {
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
        campaign.userId = id;

        // const formatedDays = ParseArrayToString(data.selectedDays);
        //  const formatedAgeGroups =  ParseArrayToString(data.ageGroups);
        //  const formatedRegions = ParseArrayToString(data.targetRegions);
        //  console.log("Days:   "+formatedDays);
        //  campaign.selectedDays = formatedDays;   
        //  campaign.ageGroups =formatedAgeGroups;   
        //  campaign.targetRegions =formatedRegions;
         


        await campaign.save();

        return campaign;
    } catch (error) {
        throw new Error(`Error creating campaign: ${error.message}`);
    }
};


const getAllCampaigns = async (id) => {
    try {
        // Fetch all campaigns for the user with the given id
        if (!id) {
            throw new Error("User ID is required");
        }
        const campaigns = await campaignRepository.findAll({
            where: {
                userId: id,
                isApproved: {
                    [Op.ne]: 'PENDING'
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
                isPayment: campaign.isPayment,
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

const getCampaignById = async(campaignId)=>{
 try {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    const campaign = await campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  } catch (error) {
    throw new Error(`Error fetching campaign by ID: ${error.message}`);
  }
};

module.exports = {
    createCampaign, getAllCampaigns, updateCampaignStatus,getCampaignById
}