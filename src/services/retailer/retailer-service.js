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
            const productFile = (data?.productFiles || []).find(file =>
                typeof file === 'string' && file.match(/\.(mp4|mov|avi|webm)$/i)
            ) || null;
            return {
                id: data.id,
                campaignName: data?.campaignName,
                productFile,
                startDate:data?.startDate,
                endDate:data?.endDate,
                startTime:data?.startTime,
                endTime:data?.endTime
                ,
                targetDevices,
                isApproved :data?.isApproved,
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