const { CampaignService } = require("../../services");


const createCampaign = async (req, res) => { 
    try {
        const campaign = await CampaignService.createCampaign(req.body);
        return res.status(201).json({
            message: "Campaign created successfully",
            data: campaign
        });
       
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createCampaign };