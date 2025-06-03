const { CampaignService } = require("../../services");
const multer = require("multer");
const upload = multer();
const { Logger } = require("../../config");
const fs = require("fs");
const path = require("path");
const { STATUS_CODES } = require("http");

const createCampaign = async (req, res) => {

  try {
    console.log(req.body);
    Logger.info("------------");
    Logger.info("Received request to create campaign");

    if (!req.file) {
      Logger.error(" video/images file is required");
      return res.status(400).json({ message: " video/images file is required." });
    }

    Logger.info(`Uploaded file name: ${req.file.originalname}, size: ${req.file.size} bytes`);

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const campaign = await CampaignService.createCampaign(req.body, fileBuffer, originalName);

    Logger.info("Campaign created successfully");
    Logger.info("------------");

    return res.json({
      message: "Campaign created successfully",
      data: campaign,
      success: true,
      status: 200
    });


  } catch (error) {
    Logger.error("Error creating campaign:", error);
    Logger.info("------------");
    res.json({
      message: "Internal server error",
      error: error.message || "An unexpected error occurred",
      success: false,
      status: 500
    });
  }
};

const getCampaigns = async (req, res) => {
  console.log("Fetching campaigns");
  const campaigns = await CampaignService.getAllCampaigns();
  return res.json(campaigns);
}


const updateCampaignStatus = async (req, res) => {
  const { id } = req.params;
   const {status} = req.body;
console.log(req.body);
  console.log(status +"  "+ id);


  try {
    const campaign = await CampaignService.updateCampaignStatus(id,status);

    return res.json({
     message: `${campaign.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`,
      success: true,
      status: 200
    });
  } catch (error) {
    Logger.error("Error updating campaign status:", error);
    res.json({
      message: "Internal server error",
      error: error.message || "An unexpected error occurred",
      success: false,
      status: 500
    });
  }


}
module.exports = { createCampaign, getCampaigns, updateCampaignStatus };