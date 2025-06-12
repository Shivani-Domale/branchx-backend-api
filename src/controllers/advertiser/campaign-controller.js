const { Logger } = require("../../config");
const { CampaignService } = require("../../services");
const { StatusCodes } = require('http-status-codes');
const { SuccessReposnse, ErrorReponse } = require("../../utils");



const createCampaign = async (req, res) => {
  try {
    const user = req.user;

    console.log(user);
    if (!user) {
      ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
    }

   console.log(req.body);
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



const getCampaigns = async (req, res) => {
  Logger.info("Fetching campaigns");
  const user = req.user;

  if (!user) {
    ErrorReponse(res, StatusCodes.UNAUTHORIZED, "Please Login...");
  }

  const campaigns = await CampaignService.getAllCampaigns(user.id);
  SuccessReposnse(res, null, StatusCodes.OK, campaigns);
}


const updateCampaignStatus = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const campaign = await CampaignService.updateCampaignStatus(id, status);

    SuccessReposnse(res, `${campaign.campaignName} Ad ${status === true ? 'Activated' : 'Deactivated'} successfully`, StatusCodes.OK, null);
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
      return res.status(404).json({ message: 'Campaign not found' });
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
    console.log(campaigns);
    
    if(!campaigns) {
      return res.status(StatusCodes.NOT_FOUND).json({
        data : [],
        success : false,
        error : "No campaign found"
      })
    }
   
    SuccessReposnse(res, null, StatusCodes.OK, campaigns);

  } catch (error) {
    console.error("Error in getUserCampaignByToken:", error.message);
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getDeviceTypes = async (req, res) => {
  console.log("getDeviceTypes endpoint hit");
  try {
    const devices = await CampaignService.getDeviceTypes();

    const filteredDevices = devices.map(d => ({
      deviceType: d.deviceType,
      availableCount: d.availableCount,
      price :d.price
    }));

    SuccessReposnse(res, null, StatusCodes.OK, filteredDevices);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getLocations = async (req, res) => {
  console.log("getLocations endpoint hit");
  try {
    const locations = await CampaignService.getLocations();
    const cityPriceList = locations.map(loc => ({
      city: loc.city,
      price: loc.price
    }));
    SuccessReposnse(res, null, StatusCodes.OK, cityPriceList);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const getProductTypes = async (req, res) => {
  console.log("getProductTypes endpoint hit");
  try {
    const products = await CampaignService.getProductTypes();
    const filteredProducts = products.map(p => ({
      product_type: p.product_type,
      price: p.price
    }));
    SuccessReposnse(res, null, StatusCodes.OK, filteredProducts);
  } catch (error) {
    ErrorReponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    Logger.info("Received request to update campaign with ID:", id);

    // Check if the user is authenticated
    // Uncomment the following lines if you want to check for user authentication

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



module.exports = { createCampaign, getCampaigns, updateCampaignStatus, getCampaignById, getUserCampaignByToken, getDeviceTypes, getProductTypes, getLocations, updateCampaign };