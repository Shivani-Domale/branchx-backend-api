const { CampaignRepository, ProductRepository, DeviceRepository, LocationRepository } = require("../../repositories");
const { GenerateBaseCostForCampaigns, UploadFile, formatToTimeString, convertTo12HourFormat } = require("../../utils");
const { sequelize } = require("../../models");



const campaignRepository = new CampaignRepository();
const productRepository = new ProductRepository();
const deviceRepository = new DeviceRepository();
const locationRepository = new LocationRepository();

const createCampaign = async (data, fileBuffer, originalName, id) => {
  const t = await sequelize.transaction();

  try {


    const parsedDevices = JSON.parse(data?.adDevices || "[]");
    const DeviceTypes = parsedDevices?.map(device => device?.name);

    const parsedProduct = JSON.parse(data?.productType || "{}");
    const ProductType = parsedProduct?.name;

    const Locations = JSON.parse(data?.targetRegions || "[]");

    if (!Array.isArray(DeviceTypes) || DeviceTypes?.length === 0) {
      throw new Error("Device types must be a non-empty array.");
    }

    if (!Array.isArray(Locations) || Locations?.length === 0) {
      throw new Error("Cities (locations) must be a non-empty array.");
    }

    const deviceRecords = await deviceRepository.findByDeviceTypes(DeviceTypes);
    const locationRecords = await locationRepository.findByCities(Locations);
    const productId = await productRepository.findIdByProductType(ProductType);

    const deviceIds = deviceRecords?.map(device => device?.id);
    const locationIds = locationRecords?.map(loc => loc?.id);

    if (deviceIds?.length === 0) {
      throw new Error("No matching devices found for selected types.");
    }

    if (locationIds?.length === 0) {
      throw new Error("No matching locations found for selected cities.");
    }

    data.userId = id;
    data.productId = productId;
    data.isPayment = false;
    data.startTime = formatToTimeString(data?.startTime);
    data.endTime = formatToTimeString(data?.endTime);
    const campaign = await campaignRepository.create(data, { transaction: t });

    if (!campaign) {
      throw new Error("Campaign creation failed");
    }

    if (!fileBuffer || !originalName) {
      throw new Error("Creative file is required.");
    }

    const creativeUrl = await UploadFile(fileBuffer, originalName, campaign?.id);

    if (!creativeUrl) {
      throw new Error("Failed to upload video/image");
    }

    campaign.creativeFile = creativeUrl;
    await campaign.save({ transaction: t });

    if (deviceIds?.length) {

      await campaign?.addDevices(deviceIds, { transaction: t });
    }

    if (locationIds?.length) {

      await campaign?.addLocations(locationIds, { transaction: t });
    }

    await t.commit();

    return campaign;

  } catch (error) {
    await t.rollback();

    throw new Error(`Error creating campaign: ${error?.message}`);
  }
};

const getAllCampaigns = async (id) => {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const campaigns = await campaignRepository.findByUserId(id);

    if (!campaigns || campaigns?.length === 0) {
      throw new Error("No campaign found");
    }

    const data = campaigns?.map(campaign => {
      const date = new Date(campaign?.startDate);
      const formattedDate = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });

      return {
        id: campaign?.id,
        campaignName: campaign?.campaignName,
        scheduleDate: formattedDate,
        startTime: campaign?.startTime,
        endTime: campaign?.endTime,
        campaignObjective: campaign?.campaignObjective,
        creativeFile: campaign?.creativeFile,
        status: campaign?.status,
        isApproved: campaign?.isApproved,
        isPayment: campaign?.isPayment,
        campaignCode: campaign?.campaignCode
      };
    });

    return data;
  } catch (error) {
    throw new Error(`Error fetching campaigns: ${error?.message}`);
  }
};

const updateCampaignStatus = async (id, status) => {
  try {
    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    campaign.status = !!status;

    await campaign?.save();
    return campaign;
  } catch (error) {
    throw new Error(`Error updating campaign status: ${error?.message}`);
  }
};

const getCampaignById = async (campaignId) => {
  try {
    if (!campaignId) {
      throw new Error("Campaign ID is required");
    }

    const campaign = await campaignRepository.findByIdWithLocationAndDevice(campaignId);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const campaignData = campaign.toJSON();

    campaignData.targetRegions = campaignData?.Locations?.map(location => ({
      name: location?.city
    }));

    campaignData.adDevices = campaignData?.Devices?.map(device => ({
      name: device?.deviceType
    }));


    campaignData.productType = {
      name: campaignData.Product?.product_type
    };


    campaignData.startTime = convertTo12HourFormat(campaignData.startTime);
    campaignData.endTime = convertTo12HourFormat(campaignData.endTime);

    delete campaignData.Locations;
    delete campaignData.Devices;
    delete campaignData.Product;

    return campaignData;
  } catch (error) {
    throw new Error(`Error fetching campaign by ID: ${error?.message}`);
  }
};


const getDeviceTypes = async () => {
  try {
    const devices = await deviceRepository.getAll();
    return devices;
  } catch (error) {
    throw new Error(`Error fetching devices: ${error?.message}`);
  }
};

const getLocations = async () => {
  try {
    const locations = await locationRepository.findAll();
    const cityPriceList = locations?.map(loc => ({
      city: loc?.city,
    }));

    if (!cityPriceList?.length) {
      throw new Error("No cities found");
    }

    return cityPriceList;
  } catch (error) {
    throw new Error(`Error fetching locations: ${error?.message}`);
  }
};

const getProductTypes = async () => {
  try {
    const products = await productRepository.getAll();
    return products;
  } catch (error) {
    throw new Error(`Error fetching products: ${error?.message}`);
  }
};

const updateCampaign = async (id, data, fileBuffer, originalName) => {
  const t = await sequelize.transaction();
  try {
    const campaign = await campaignRepository.findByIdWithLocationAndDevice(id);
    if (!campaign) throw new Error("Campaign not found");

 
    data.startTime = formatToTimeString(data?.startTime);
    data.endTime = formatToTimeString(data?.endTime);
    data.daysOfWeek = JSON.stringify(data?.daysOfWeek || []);

    if (fileBuffer && originalName) {
      const newCreativeUrl = await UploadFile(fileBuffer, originalName, campaign?.id);
      data.creativeFile = newCreativeUrl;
    }

    
    if (data?.targetRegions?.length) {
      const newCities = data?.targetRegions.map(loc => loc?.name).sort();
      const oldCities = campaign?.Locations.map(loc => loc?.city).sort();

      if (JSON.stringify(newCities) !== JSON.stringify(oldCities)) {
        const newLocationRecords = await locationRepository.findByCities(newCities);
        await campaign.setLocations(newLocationRecords, { transaction: t });
      }
    }

   
    if (data?.adDevices?.length) {
      const newDeviceTypes = data?.adDevices.map(dev => dev?.name).sort();
      const oldDeviceTypes = campaign?.Devices.map(dev => dev?.deviceType).sort();

      if (JSON.stringify(newDeviceTypes) !== JSON.stringify(oldDeviceTypes)) {
        const newDeviceRecords = await deviceRepository.findByDeviceTypes(newDeviceTypes);
        await campaign.setDevices(newDeviceRecords, { transaction: t });
      }
    }
    const productName = data?.productType?.name;
   
    if (productName) {
      const existingProduct = await productRepository.findByProductName(productName);

      if (!existingProduct) {
        throw new Error(`Product not found: ${data.productType.name}`);
      }

      if (existingProduct?.id !== campaign?.productId) {
        campaign.productId = existingProduct.id;
      }
    }

    // Clean up unnecessary props before bulk assigning
    delete data.productType;
    delete data.targetRegions;
    delete data.adDevices;

    // Assign rest of data
    Object.assign(campaign, data);

    await campaign.save({ transaction: t });
    await t.commit();

    return campaign;
  } catch (error) {
    await t.rollback();
    console.error("Error updating campaign:", error);
    throw new Error(`Error updating campaign: ${error?.message}`);
  }
};



const deleteCampaign = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const result = await campaignRepository.deleteById(id, transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error deleting campaign: ${error?.message}`);
  }
};

const calculateBaseCost = async (adDevices, productType, targetRegions) => {
  try {
    const devices = await deviceRepository.findByDeviceTypes(adDevices);
    const locations = await locationRepository.findByCities(targetRegions);
    const product = await productRepository.findProductById(productType);

    if (!devices || !locations || !product) {
      throw new Error("Devices, locations, or product not found.");
    }

    const baseCost = await GenerateBaseCostForCampaigns({ devices, locations, product });
    return baseCost;
  } catch (error) {
    throw new Error(`Error calculating base cost: ${error?.message}`);
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  updateCampaignStatus,
  getCampaignById,
  getDeviceTypes,
  getProductTypes,
  getLocations,
  deleteCampaign,
  updateCampaign,
  calculateBaseCost
};
