const { Logger } = require("../../config");
const { CampaignService } = require("../../services");
const { StatusCodes } = require('http-status-codes');
const { SuccessReposnse, ErrorReponse } = require("../../utils");

const createCampaign = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    Logger.info("------------");
    Logger.info("Received request to create campaign");

    if (!req?.file) {
      Logger.error("video/image file is required");
      return ErrorReponse(res, StatusCodes.NO_CONTENT, "video/image file is required!");
    }

    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/avi"];
    if (!allowedTypes.includes(req?.file?.mimetype)) {
      Logger.error("Invalid file type:", req?.file?.mimetype);
      return ErrorReponse(
        res,
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        "Invalid file type. Only JPG, PNG, MP4, AVI allowed."
      );
    }

    Logger.info(`Uploaded file: ${req?.file?.originalname}, size: ${req?.file?.size} bytes`);

    const fileBuffer = req?.file?.buffer;
    const originalName = req?.file?.originalname;

    const campaign = await CampaignService.createCampaign(req?.body, fileBuffer, originalName, user?.id);

    Logger.info("Campaign created successfully");
    Logger.info("------------");

    return SuccessReposnse(res, null, StatusCodes.OK, campaign);

  } catch (error) {
    Logger.error("Error creating campaign:", error);
    Logger.error("------------");
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req?.params;
    const { status } = req?.body;

    const campaign = await CampaignService.updateCampaignStatus(id, status);
    if (!campaign) {
      return ErrorReponse(res, StatusCodes.NOT_FOUND, 'Unable To Update Campaign Status');
    }

    const message = `${campaign?.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`;
    return SuccessReposnse(res, message, StatusCodes.OK, null);

  } catch (error) {
    Logger.error("Error updating campaign status:", error);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getCampaignById = async (req, res) => {
  try {
    const { campaignId } = req?.params;
    const campaign = await CampaignService.getCampaignById(campaignId);

    if (!campaign) {
      return ErrorReponse(res, StatusCodes.BAD_REQUEST, 'Campaign not found');
    }

    return SuccessReposnse(res, null, StatusCodes.OK, campaign);
  } catch (error) {
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getUserCampaignByToken = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    const campaigns = await CampaignService.getAllCampaigns(user?.id);

    if (!campaigns || campaigns?.length === 0) {
      return ErrorReponse(res, StatusCodes.NOT_FOUND, 'No campaign found');
    }

    return SuccessReposnse(res, null, StatusCodes.OK, campaigns);

  } catch (error) {
    Logger.error("Error in getUserCampaignByToken:", error?.message);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getDeviceTypes = async (req, res) => {
  try {
    const devices = await CampaignService.getDeviceTypes();
    const filteredDevices = devices?.map(d => ({ deviceType: d?.deviceType }));

    if (!filteredDevices || filteredDevices?.length === 0) {
      return ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Devices Found');
    }

    return SuccessReposnse(res, null, StatusCodes.OK, filteredDevices);
  } catch (error) {
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await CampaignService.getLocations();

    if (!locations || locations?.length === 0) {
      return ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Cities Found');
    }

    return SuccessReposnse(res, "Data fetched successfully", StatusCodes.OK, locations);
  } catch (error) {
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const getProductTypes = async (req, res) => {
  try {
    const products = await CampaignService.getProductTypes();
    const filteredProducts = products?.map(p => ({ product_type: p?.product_type }));

    if (!filteredProducts || filteredProducts?.length === 0) {
      return ErrorReponse(res, StatusCodes.NOT_FOUND, 'No Product Category Found');
    }

    return SuccessReposnse(res, null, StatusCodes.OK, filteredProducts);
  } catch (error) {
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req?.params;

    Logger.info("Received request to update campaign with ID:", id);

    const user = req?.user;
    if (!user) {
      return ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    const fileBuffer = req?.file?.buffer || null;
    const originalName = req?.file?.originalname || null;

    const updatedCampaign = await CampaignService.updateCampaign(id, req?.body, fileBuffer, originalName);

    return SuccessReposnse(res, "Campaign updated successfully", StatusCodes.OK, updatedCampaign);

  } catch (error) {
    Logger.error("Error updating campaign:", error);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const user = req?.user;
    if (!user) {
      return ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

    const { campaignId } = req?.params;
    const result = await CampaignService.deleteCampaign(campaignId);

    return SuccessReposnse(res, 'Campaign soft deleted successfully.', StatusCodes.OK, result);
  } catch (error) {
    Logger.error('Error deleting campaign:', error);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

const calculateBaseCost = async (req, res) => {
  try {
    const { adDevices, productType, targetRegions } = req?.body;

    const baseCost = await CampaignService.calculateBaseCost(adDevices, productType, targetRegions);

    return SuccessReposnse(res, "Base cost calculated successfully", StatusCodes.OK, { baseCost });
  } catch (error) {
    Logger.error("Error calculating base cost:", error?.message);
    return ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error?.message);
  }
};

module.exports = {
  createCampaign,
  updateCampaignStatus,
  getCampaignById,
  getUserCampaignByToken,
  getDeviceTypes,
  getProductTypes,
  getLocations,
  updateCampaign,
  deleteCampaign,
  calculateBaseCost
};
