const generateBaseCostForCampaigns = async ({ devices, product, locations }) => {
    try {
        const deviceRate = devices?.reduce((sum, d) => sum + (d?.price || 0), 0) || 0;
        const locationRate = locations?.reduce((sum, l) => sum + (l?.price || 0), 0) || 0;
        const productRate = product?.price || 0;
        const deviceCount = locations?.reduce((sum, l) => sum + (l?.deviceCount || 0), 0) || 0;

        const baseCost = (deviceRate + locationRate + productRate) * deviceCount;
        return baseCost;

    } catch (error) {
        console.error("Error calculating base cost:", error.message);
        throw error;
    }
};

module.exports = generateBaseCostForCampaigns;
