const { CampaignRepository } = require("../../repositories");

const campaignRepository = new CampaignRepository();
const getAllApprovedCampaigns = async () => {
    try {
        const campaign = await campaignRepository.findAllApproved();
        if (!campaign) {
            throw new Error("No Campaigns Found!");
        }
        const formattedCampaigns = campaign.map(campaigns => {
            const data = campaigns.toJSON();
            const targetDevices = [...new Set(data?.devices?.map(device => device?.deviceName) || [])];

            return {
                id: data.id,
                campaignName: data?.campaignName,
                productFiles:data?.productFiles
                ,
                targetDevices
            };
        });

        return formattedCampaigns;
    } catch (error) {
        throw new Error(" Error While Fetching Campaigns! " + error);
    }
};


module.exports = {
    getAllApprovedCampaigns
};