const { Logger } = require("../../config");
const { CampaignService } = require("../../services");
const { StatusCodes } = require('http-status-codes');
const { SuccessReposnse, ErrorReponse } = require("../../utils");



const createCampaign = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    Logger.info("------------");
    Logger.info("Received request to create campaign");

    if (!req.file) {
      Logger.error(" video/images file is required");
      ErrorReponse(res, StatusCodes.NO_CONTENT, "video/image required !");
    }

    Logger.info(`Uploaded file name: ${req.file.originalname}, size: ${req.file.size} bytes`);

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    const campaign = await CampaignService.createCampaign(req.body, fileBuffer, originalName, user.id);

    Logger.info("Campaign created successfully");
    Logger.info("------------");

    SuccessReposnse(res, null, StatusCodes.OK, campaign);

  } catch (error) {
    Logger.error("Error creating campaign:", error);
    Logger.error("------------");
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};



const updateCampaignStatus = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const campaign = await CampaignService.updateCampaignStatus(id, status);

    if (!campaign) {
      ErrorReponse(res, StatusCodes.NOT_FOUND, 'Unable To Update Campaign Status');
    }
  
    const message = `${campaign.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`;

    return SuccessReposnse(res, message, StatusCodes.OK, null);
  } catch (error) {
    Logger.error("Error updating campaign status:", error);
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getCampaignById = async (req, res) => {

  const { campaignId } = req.params;
  try {
    
    const campaign = await CampaignService.getCampaignById(campaignId);

  
    if (!campaign) {
      return ErrorReponse(res, StatusCodes.BAD_REQUEST, 'Campaign not found');
    }

    SuccessReposnse(res, null, StatusCodes.OK, campaign);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getUserCampaignByToken = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login in..");
    }

    const campaigns = await CampaignService.getAllCampaigns(user.id);


    if (!campaigns || campaigns.length === 0) {
      ErrorReponse(res, StatusCodes.NOT_FOUND, 'No campaign found');
    }

    SuccessReposnse(res, null, StatusCodes.OK, campaigns);

  } catch (error) {
    console.error("Error in getUserCampaignByToken:", error.message);
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getDeviceTypes = async (req, res) => {

  try {
    const devices = await CampaignService.getDeviceTypes();

    const filteredDevices = devices.map(d => ({
      deviceType: d.deviceType,
    }));

    if (!filteredDevices) {
      ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Devices Found');
    }

    SuccessReposnse(res, null, StatusCodes.OK, filteredDevices);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getLocations = async (req, res) => {

  try {
    const locations = await CampaignService.getLocations();


    if (!locations || locations.length === 0) {
      ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Cities Found');
    }

    SuccessReposnse(res, "Data fetch successfully", StatusCodes.OK, locations);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getProductTypes = async (req, res) => {

  try {
    const products = await CampaignService.getProductTypes();
    const filteredProducts = products.map(p => ({
      product_type: p.product_type,
    }));

    if (!filteredProducts) {
      ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Product Catrgory Found');
    }

    SuccessReposnse(res, null, StatusCodes.OK, filteredProducts);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    Logger.info("Received request to update campaign with ID:", id);

    const user = req.user;

    if (!user) {
      return ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    const fileBuffer = req.file ? req.file.buffer : null;
    const originalName = req.file ? req.file.originalname : null;

    const updatedCampaign = await CampaignService.updateCampaign(id, req.body, fileBuffer, originalName);
    SuccessReposnse(res, "Campaign updated successfully", StatusCodes.OK, updatedCampaign);

  } catch (error) {
    Logger.error("Error updating campaign:", error);
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteCampaign = async (req, res) => {
  try {

    const { id } = req.params;

    SuccessReposnse(res, 'campaign deleted', StatusCodes.OK, null);
  } catch (error) {
    ErrorReponse(res, StatusCodes.BAD_REQUEST, error);
  }
};

const calculateBaseCost = async (req, res) => {
  try {
    const { adDevices, productType, targetRegions } = req.body;
    console.log(req.body);
    const baseCost = await CampaignService.calculateBaseCost(adDevices, productType, targetRegions);

    return SuccessReposnse(res, "Base cost calculated successfully", StatusCodes.OK, { baseCost });
  } catch (error) {
    console.error("Error calculating base cost:", error.message);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


module.exports = {
  createCampaign, updateCampaignStatus, getCampaignById,
  getUserCampaignByToken, getDeviceTypes, getProductTypes,
  getLocations, updateCampaign, deleteCampaign,
  calculateBaseCost
};