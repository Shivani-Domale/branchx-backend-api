
const { CampaignRepository, ProductRepository, DeviceRepository, LocationRepository } = require("../../repositories");

const { GenerateBaseCostForCampaigns, UploadFile } = require("../../utils");

const { sequelize } = require("../../models");
const { Logger } = require("../../config");

const campaignRepository = new CampaignRepository();
const productRepository = new ProductRepository();
const deviceRepository = new DeviceRepository();
const locationRepository = new LocationRepository();

const createCampaign = async (data, fileBuffer, originalName, id) => {
  const t = await sequelize.transaction();

  try {
    Logger.info("Starting campaign creation...");


    const parsedDevices = JSON.parse(data.adDevices || "[]");
    const DeviceTypes = parsedDevices.map(device => device.name);

    const parsedProduct = JSON.parse(data.productType || "{}");
    const ProductType = parsedProduct.name;


    const Locations = JSON.parse(data.targetRegions || "[]");


    if (!Array.isArray(DeviceTypes) || DeviceTypes.length === 0) {
      throw new Error("Device types must be a non-empty array.");
    }

    if (!Array.isArray(Locations) || Locations.length === 0) {
      throw new Error("Cities (locations) must be a non-empty array.");
    }

    const deviceRecords = await deviceRepository.findByDeviceTypes(DeviceTypes);
    const locationRecords = await locationRepository.findByCities(Locations);
    const productId = await productRepository.findIdByProductType(ProductType);

    const deviceIds = deviceRecords.map(device => device.id);
    const locationIds = locationRecords.map(loc => loc.id);

    if (deviceIds.length === 0) {
      throw new Error("No matching devices found for selected types.");
    }

    if (locationIds.length === 0) {
      throw new Error("No matching locations found for selected cities.");
    }


    data.userId = id;
    data.productId = productId;
    data.isPayment = false;
    const campaign = await campaignRepository.create(data, { transaction: t });

    if (!campaign) {
      throw new Error("Campaign creation failed");
    }


    if (!fileBuffer || !originalName) {
      throw new Error("Creative file is required.");
    }

    const creativeUrl = await UploadFile(fileBuffer, originalName, campaign.id);

    if (!creativeUrl) {
      throw new Error('Failed to upload video/image ');
    }

    campaign.creativeFile = creativeUrl;

    await campaign.save({ transaction: t });

    if (deviceIds.length) {
      Logger.info("Associating devices...");
      await campaign.addDevices(deviceIds, { transaction: t });
    }


    if (locationIds.length) {
      Logger.info("Associating locations...");
      await campaign.addLocations(locationIds, { transaction: t });
    }

    await t.commit();
    Logger.info("Campaign created successfully.");
    return campaign;

  } catch (error) {
    await t.rollback();
    Logger.error("Error creating campaign:", error.message);
    throw new Error(`Error creating campaign: ${error.message}`);
  }
};


const getAllCampaigns = async (id) => {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const campaigns = await campaignRepository.findByUserId(id);

    if (!campaigns || campaigns.length === 0) {
      throw new Error("no campaign found")
    }

    const data = campaigns.map(campaign => {
      const date = new Date(campaign.scheduleDate);
      const formattedDate = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });

      return {
        id: campaign.id,
        campaignName: campaign.campaignName,
        scheduleDate: formattedDate,
        timeSlot: campaign.timeSlot,
        campaignObjective: campaign.campaignObjective,
        creativeFile: campaign.creativeFile,
        status: campaign.status,
        isApproved: campaign.isApproved,
        isPayment: campaign.isPayment,
        campaignCode: campaign.campaignCode
      };
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

const getCampaignById = async (campaignId) => {
  try {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    const campaign = await campaignRepository.findByIdWithLocationAndDevice(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Convert to plain object
    const campaignData = campaign.toJSON();

    // Keep only city and deviceType in respective arrays
    campaignData.Locations = campaignData.Locations.map(location => ({
      city: location.city
    }));

    campaignData.Devices = campaignData.Devices.map(device => ({
      deviceType: device.deviceType
    }));

    return campaignData;

  } catch (error) {
    throw new Error(`Error fetching campaign by ID: ${error.message}`);
  }
};


const getDeviceTypes = async () => {
  try {
    const devices = await deviceRepository.getAll();
    return devices;
  } catch (error) {
    throw new Error(`Error fetching devices: ${error.message}`);
  }
};

const getLocations = async () => {
  try {
    const locations = await locationRepository.findAll();

    const cityPriceList = locations.map(loc => ({
      city: loc.city,
    }));
    if (!cityPriceList) {
      throw new Error(" no cities are found");
    }

    return cityPriceList;
  } catch (error) {
    throw new Error(`Error fetching locations: ${error.message}`);
  }
};

const getProductTypes = async () => {
  try {
    const products = await productRepository.getAll();
    return products;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

const updateCampaign = async (id, data, fileBuffer, originalName) => {
  const t = await sequelize.transaction();

  try {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Only update the fields passed in request body
    Object.assign(campaign, data);

    if (fileBuffer && originalName) {
      const newCreativeUrl = await UploadFile(fileBuffer, originalName, campaign.id);
      campaign.creativeFile = newCreativeUrl;
    }

    await campaign.save({ transaction: t });

    await t.commit();
    return campaign;
  } catch (error) {
    await t.rollback();
    Logger.error("Error updating campaign:", error.message);
    throw new Error(`Error updating campaign: ${error.message}`);
  }
};

const deleteCampaign = async (id) => {
  const campaign = await campaignRepository.findById(id);

  if (!campaign) {
    throw new Error('Unable to delete campaign');
  }

  let imageDeleted = false;

  if (campaign.creativeFile) {
    try {
      await DeleteFileFromAWS(campaign.creativeFile);
      imageDeleted = true;
    } catch (error) {
      Logger.error(`Failed to delete file from AWS: ${error.message}`);
      // Do not throw — proceed with disabling the campaign
    }
  }

  campaign.status = false; // Soft delete
  await campaign.save();

  return {
    id: campaign.id,
    campaignName: campaign.campaignName,
    imageDeleted
  };
};

const calculateBaseCost = async (adDevices, productType, targetRegions) => {

  const devices = await deviceRepository.findByDeviceTypes(adDevices);
  const locations = await locationRepository.findByCities(targetRegions);
  const product = await productRepository.findProductById(productType);

  if (!devices || !locations || !product) {
    throw new Error("Devices, locations, or product not found.");
  }

  const baseCost = await GenerateBaseCostForCampaigns({ devices, locations, product });
  return baseCost;
};


module.exports = {
  createCampaign, getAllCampaigns, updateCampaignStatus,
  getCampaignById, getDeviceTypes, getProductTypes,
  getLocations, deleteCampaign, updateCampaign,
  calculateBaseCost
};