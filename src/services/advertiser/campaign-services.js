const { CampaignRepository, ProductRepository, DeviceRepository, LocationRepository } = require("../../repositories");
const { GenerateBaseCostForCampaigns, UploadFile, formatToTimeString, convertTo12HourFormat, UpdateMetaDataForFile } = require("../../utils");
const { sequelize } = require("../../models");



const campaignRepository = new CampaignRepository();
const productRepository = new ProductRepository();
const deviceRepository = new DeviceRepository();
const locationRepository = new LocationRepository();



const createCampaign = async (data, fileBuffer, userId) => {
  const t = await sequelize.transaction();

  try {
    const urls = [];

    const DeviceTypes = typeof data?.targetDevices === 'string'
      ? JSON.parse(data.targetDevices)
      : data?.targetDevices || [];

    const ProductTypes = typeof data?.product === 'string'
      ? JSON.parse(data.product)
      : data?.product || [];

    const Locations = typeof data?.regions === 'string'
      ? JSON.parse(data.regions)
      : data?.regions || [];

    if (!Array.isArray(DeviceTypes) || DeviceTypes.length === 0) {
      throw new Error("Device types must be a non-empty array.");
    }

    if (!Array.isArray(Locations) || Locations.length === 0) {
      throw new Error("Target locations must be a non-empty array.");
    }

    if (!Array.isArray(ProductTypes) || ProductTypes.length === 0) {
      throw new Error("Product type must be a non-empty array.");
    }
    const deviceRecords = await deviceRepository.findByDeviceTypes(DeviceTypes);
    const locationRecords = await locationRepository.findByCities(Locations);
    const productId = await productRepository.findIdByProductType(ProductTypes[0]); // pick first

    const deviceIds = deviceRecords.map(d => d.id);
    const locationIds = locationRecords.map(l => l.id);

    // Extract timings
    const [startTimeRaw, endTimeRaw] = (data?.timings || "").split("-") || [];
    const startTime = startTimeRaw; // e.g., "01:00:00"
    const endTime = endTimeRaw;

    // Extract dates
    const parsedDateRange = typeof data?.dateRange === 'string'
      ? JSON.parse(data.dateRange)
      : data.dateRange || {};

    const startDate = parsedDateRange?.start ? new Date(parsedDateRange.start) : null;
    const endDate = parsedDateRange?.end ? new Date(parsedDateRange.end) : null;

    const campaignPayload = {
      campaignName: data.campaignName,
      brandName: data.brandName,
      adType: data.adType,
      baseBid: data.baseBid,
      duration: data.duration,
      maxBid: data.maxBidCap,
      campaignBudget: data.campaignBudget,
      storeType: data.storeTypes,
      startDate,
      endDate,
      startTime,
      endTime,
      userId,
      productId,
    };

    const campaign = await campaignRepository.create(campaignPayload, { transaction: t });

    for (const file of fileBuffer) {
      const fileName = file?.originalname || `file-${Date.now()}.${file.mimetype?.split("/")?.[1] || "bin"}`;
      if (!file.buffer) throw new Error(`Invalid file buffer for: ${fileName}`);

      const url = await UploadFile(file.buffer, fileName, campaign.id);
      urls.push(url);
    }

    campaign.productFiles = urls;
    await campaign.save({ transaction: t });

    await campaign.addDevices(deviceIds, { transaction: t });
    await campaign.addLocations(locationIds, { transaction: t });

    await t.commit();
    UpdateMetaDataForFile(campaign.id);
    return campaign;
  } catch (error) {
    await t.rollback();
    throw new Error(`Error creating campaign: ${error.message}`);
  }
};




const getAllCampaigns = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const campaigns = await campaignRepository.findByUserId(userId); // includes associations

    if (!campaigns || campaigns.length === 0) {
      throw new Error("No campaigns found");
    }

    const formattedCampaigns = campaigns.map(campaign => {
      const data = campaign.toJSON();

      const regions = data?.locations?.map(location => location?.city) || [];

      const targetDevices = data?.devices?.map(device => device?.deviceName) || [];

      const product = [data?.product?.product_type || ""];
      ;
      const image = (data.productFiles || []).find(file =>
        typeof file === 'string' &&
        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
      );

      const dateRange = {
        start: new Date(data.startDate).toISOString().split("T")[0],
        end: new Date(data.endDate).toISOString().split("T")[0]
      };

      const timings = `${data?.startTime?.toUpperCase() || ""}-${data?.endTime?.toUpperCase() || ""}`;

      return {
        id: data.id,
        campaignName: data.campaignName,
        brandName: data.brandName,
        adType: data.adType,
        duration: data.duration?.toString(),
        baseBid: data.baseBid,
        maxBidCap: data.maxBid,
        campaignBudget: data.campaignBudget,
        storeTypes: data.storeType,
        targeting: data.targeting,
        achieveStatus: data.achieveStatus,
        isApproved: data.isApproved,
        isPayment: data.isPayment,
        productFiles: data.productFiles,
        image, // single image
        dateRange,
        timings,
        regions,
        targetDevices,
        product,
        startDate: new Date(data.startDate).toISOString().split("T")[0],
        endDate: new Date(data.endDate).toISOString().split("T")[0],
        startTime: (data?.startTime).toUpperCase(),
        endTime: (data?.endTime).toUpperCase(),
      };
    });

    return formattedCampaigns;

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
      name: device?.deviceName
    }));


    campaignData.productType = {
      name: campaignData.Product?.product_type
    };


    campaignData.startTime = campaignData?.startTime?.toUpperCase();
    campaignData.endTime = campaignData?.endTime?.toUpperCase();

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

    const uniqueDevices = [];
    const seen = new Set();

    for (const device of devices) {
      if (!seen.has(device.deviceName)) {
        seen.add(device.deviceName);
        uniqueDevices.push(device);
      }
    }

    return uniqueDevices;
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



const updateCampaign = async (id, data, fileBuffer = [], userId) => {
  const t = await sequelize.transaction();  
  try {
    const campaign = await campaignRepository.findByIdWithLocationAndDevice(id);
    if (!campaign) throw new Error("Campaign not found");


    // Parse & validate input
    const DeviceTypes = typeof data?.targetDevices === 'string'
      ? JSON.parse(data.targetDevices)
      : data?.targetDevices || [];

    const ProductTypes = typeof data?.product === 'string'
      ? JSON.parse(data.product)
      : data?.product || [];

    const Locations = typeof data?.regions === 'string'
      ? JSON.parse(data.regions)
      : data?.regions || [];

    if (!Array.isArray(DeviceTypes) || DeviceTypes.length === 0)
      throw new Error("Device types must be a non-empty array.");

    if (!Array.isArray(Locations) || Locations.length === 0)
      throw new Error("Target locations must be a non-empty array.");

    if (!Array.isArray(ProductTypes) || ProductTypes.length === 0)
      throw new Error("Product type must be a non-empty array.");

    const deviceRecords = await deviceRepository.findByDeviceTypes(DeviceTypes);
    const locationRecords = await locationRepository.findByCities(Locations);
    const productId = await productRepository.findIdByProductType(ProductTypes[0]);

    const deviceIds = deviceRecords.map(d => d.id);
    const locationIds = locationRecords.map(l => l.id);

    // Extract timings
    const [startTimeRaw, endTimeRaw] = (data?.timings || "").split("-") || [];
    const startTime = startTimeRaw?.trim();
    const endTime = endTimeRaw?.trim();

    // Parse date range
    const parsedDateRange = typeof data?.dateRange === 'string'
      ? JSON.parse(data.dateRange)
      : data.dateRange || {};

    const startDate = parsedDateRange?.start ? new Date(parsedDateRange.start) : null;
    const endDate = parsedDateRange?.end ? new Date(parsedDateRange.end) : null;

    const urls = [];

    if (fileBuffer?.length > 0) {
      for (const file of fileBuffer) {
        const fileName = file?.originalname || `file-${Date.now()}.${file.mimetype?.split("/")?.[1] || "bin"}`;
        if (!file.buffer) throw new Error(`Invalid file buffer for: ${fileName}`);

        const url = await UploadFile(file.buffer, fileName, campaign.id);
        urls.push(url);
      }

      //  Only replace if new files are uploaded
      campaign.productFiles = urls;
    }

    // Update associations
    await campaign.setDevices(deviceIds, { transaction: t });
    await campaign.setLocations(locationIds, { transaction: t });

    // Update main fields
    Object.assign(campaign, {
      campaignName: data.campaignName,
      brandName: data.brandName,
      adType: data.adType,
      baseBid: data.baseBid,
      maxBid: data.maxBidCap,
      campaignBudget: data.campaignBudget,
      storeType: data.storeTypes,
      startDate,
      endDate,
      startTime,
      endTime,
      productId,
      duration: data.duration
    });

    await campaign.save({ transaction: t });
    await t.commit();
    return campaign;

  } catch (error) {
    await t.rollback();
    console.error(" Error updating campaign:", error);
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



const calculateBaseCost = async (productTypes, targetRegions, adDevices) => {
  try {
    const devices = await deviceRepository.findByDeviceTypes(adDevices);
    const locations = await locationRepository.findByCities(targetRegions);

    const products = await Promise.all(
      productTypes.map(async (type) => await productRepository.findProductById(type))
    );

    if (!devices.length || !locations.length || products.includes(null)) {
      throw new Error("Devices, locations, or one or more products not found.");
    }

    let totalBaseCost = 0;

    for (const product of products) {
      const cost = await GenerateBaseCostForCampaigns({
        devices,
        locations,
        product,
      });
      totalBaseCost += cost;
    }

    return totalBaseCost;

  } catch (error) {
    throw new Error(`Error calculating base cost: ${error.message}`);
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
