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
   ErrorReponse(res,StatusCodes.UNAUTHORIZED,"Please Login...");
    }

    console.log(req.body);
    Logger.info("------------");
    Logger.info("Received request to create campaign");

    if (!req.file) {
      Logger.error(" video/images file is required");
      ErrorReponse(res,StatusCodes.NO_CONTENT,"video/image required !");
    }

    Logger.info(`Uploaded file name: ${req.file.originalname}, size: ${req.file.size} bytes`);

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const campaign = await CampaignService.createCampaign(req.body, fileBuffer, originalName, user.id);

    Logger.info("Campaign created successfully");
    Logger.info("------------");

  SuccessReposnse(res,null,StatusCodes.OK,campaign);

  } catch (error) {
    Logger.error("Error creating campaign:", error);
    Logger.info("------------");
     ErrorReponse(res,StatusCodes.INTERNAL_SERVER_ERROR,error);
  }
};



const getCampaigns = async (req, res) => {
  Logger.info("Fetching campaigns");
  const user = req.user;

  if (!user) {
  ErrorReponse(res,StatusCodes.UNAUTHORIZED,"Please Login...");
  }

  const campaigns = await CampaignService.getAllCampaigns(user.id);
 SuccessReposnse(res,null,StatusCodes.OK,campaigns);
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
   SuccessReposnse(res,null,StatusCodes.OK,campaign);
  } catch (error) {
   ErrorReponse(res,StatusCodes.INTERNAL_SERVER_ERROR,error);
  }
};

const getUserCampaignByToken = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    if (!user) {
     ErrorReponse(res,StatusCodes.UNAUTHORIZED,"Please Login in..");
    }

    const campaigns = await CampaignService.getAllCampaigns(user.id);
    console.log(campaigns);

   SuccessReposnse(res,null,StatusCodes.OK,campaigns);

  } catch (error) {
    console.error("Error in getUserCampaignByToken:", error.message);
  ErrorReponse(res,StatusCodes.INTERNAL_SERVER_ERROR,error);
  }
};



module.exports = { createCampaign, getCampaigns, updateCampaignStatus, getCampaignById, getUserCampaignByToken };