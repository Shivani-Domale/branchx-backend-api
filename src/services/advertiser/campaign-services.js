const { Op } = require("sequelize");
const { CampaignRepository, ProductRepository, DeviceRepository, LocationRepository } = require("../../repositories");
const { UploadFile } = require("../../utils");
const {  sequelize } = require("../../models");
const { Logger } = require("../../config");


const campaignRepository = new CampaignRepository();
const productRepository = new ProductRepository();
const deviceRepository = new DeviceRepository();
const locationRepository = new LocationRepository();

const createCampaign = async (data, fileBuffer, originalName, userId) => {
    const t =await sequelize.transaction();
    try {
    Logger.info(" Starting campaign creation...");

   
    const DeviceTypes = JSON.parse(data.adDeviceShow || "[]");
    const Locations = JSON.parse(data.targetRegions || "[]");
    const ProductType = data.productType;

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


    const campaign = await campaignRepository.create(data, { transaction: t });

    if (!campaign) {
      throw new Error("Campaign creation failed");
    }

  
    if (!fileBuffer || !originalName) {
      throw new Error("Creative file is required.");
    }

    const creativeUrl = await UploadFile(fileBuffer, originalName, campaign.id);
    campaign.creativeFile = creativeUrl;

    campaign.status = false;
    campaign.isApproved = "PENDING";
    campaign.isPayment = false;
    campaign.userId = userId;
    campaign.productId = productId;

    await campaign.save({ transaction: t });

   
    if (deviceIds.length) {
      Logger.info("📡 Associating devices...");
      await campaign.addDevices(deviceIds, { transaction: t });
    }

    if (locationIds.length) {
      Logger.info(" Associating locations...");
      await campaign.addLocations(locationIds, { transaction: t });
    }

    await t.commit();
    Logger.info(" Campaign created successfully.");
    return campaign;
  } catch (error) {
    await t.rollback();
    Logger.error(" Error creating campaign:", error.message);
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
            return []; // or throw an error if you want to enforce existence
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

        const campaign = await campaignRepository.findById(campaignId);

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        return campaign;
    } catch (error) {
        throw new Error(`Error fetching campaign by ID: ${error.message}`);
    }
};

module.exports = {
    createCampaign, getAllCampaigns, updateCampaignStatus, getCampaignById
}