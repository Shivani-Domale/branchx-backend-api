const { CampaignService } = require("../../services");
const multer = require("multer");
const upload = multer();
const { Logger } = require("../../config");
const fs = require("fs");
const path = require("path");
const { StatusCodes } = require('http-status-codes');
const { SuccessReposnse, ErrorReponse } = require("../../utils");



const createCampaign = async (req, res) => {

  try {
    const user = req.user;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: " Please Login .",
        success: false,
      });
    }

    console.log(req.body);
    Logger.info("------------");
    Logger.info("Received request to create campaign");

    if (!req.file) {
      Logger.error(" video/images file is required");
      return res.status(StatusCodes.NO_CONTENT).json({ message: " video/images file is required." });
    }

    Logger.info(`Uploaded file name: ${req.file.originalname}, size: ${req.file.size} bytes`);

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const campaign = await CampaignService.createCampaign(req.body, fileBuffer, originalName, user.id);

    Logger.info("Campaign created successfully");
    Logger.info("------------");

    return res.json({
      message: "Campaign created successfully",
      data: campaign,
      success: true,
      status: StatusCodes.OK
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
  const user = req.user;

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: " Please Login .",
      success: false,
    });
  }

  const campaigns = await CampaignService.getAllCampaigns(user.id);
  return res.status(StatusCodes.OK).json(campaigns);
}


const updateCampaignStatus = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const campaign = await CampaignService.updateCampaignStatus(id, status);

    // return res.json({
    //   message: `${campaign.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`,
    //   success: true,
    //   status: StatusCodes.OK
    // });

    SuccessReposnse(res,`${campaign.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`,StatusCodes.OK,null);
  } catch (error) {
    Logger.error("Error updating campaign status:", error);
     ErrorReponse(res,StatusCodes.INTERNAL_SERVER_ERROR,error);
  }
};

const getCampaignById = async (req, res) => {

  const { campaignId } = req.params;
  try {
    const campaign = await CampaignService.getCampaignById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(
      {
        campaign: campaign
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserCampaignByToken = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const campaigns = await CampaignService.getAllCampaigns(user.id);
    console.log(campaigns);

   SuccessReposnse(res,null,StatusCodes.OK,campaigns);

  } catch (error) {
    console.error("Error in getUserCampaignByToken:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to get user campaigns",
      success: false,
    });
  }
};



module.exports = { createCampaign, getCampaigns, updateCampaignStatus, getCampaignById, getUserCampaignByToken };