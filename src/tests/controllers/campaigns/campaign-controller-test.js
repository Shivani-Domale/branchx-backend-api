const { SuccessReposnse, ErrorReponse } = require("../../../utils");
const { CampaignService } = require("../../../services");
const controller = require("../../../controllers/advertiser/campaign-controller");
const { StatusCodes } = require("http-status-codes");

jest.mock("../../../utils", () => ({
    SuccessReposnse: jest.fn(),
    ErrorReponse: jest.fn()
}));

jest.mock("../../../services", () => ({
    CampaignService: {
        createCampaign: jest.fn(),
        getCampaignById: jest.fn(),
        getAllCampaigns: jest.fn(),
        getDeviceTypes: jest.fn(),
        getProductTypes: jest.fn(),
        updateCampaign: jest.fn(),
        calculateBaseCost: jest.fn(),
        updateCampaignStatus: jest.fn(),
        getLocations: jest.fn()
    }
}));

describe("Campaign Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            file: {},
            user: { id: "user123" }
        };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    describe("createCampaign", () => {
        it("should create a campaign and return success", async () => {
            req.file = { buffer: Buffer.from("file"), originalname: "test.png", size: 1234 };
            CampaignService.createCampaign.mockResolvedValue({ id: 1 });

            await controller.createCampaign(req, res);

            expect(CampaignService.createCampaign).toHaveBeenCalled();
            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("getCampaignById", () => {
        it("should return campaign if found", async () => {
            req.params.campaignId = "1";
            CampaignService.getCampaignById.mockResolvedValue({ id: 1 });

            await controller.getCampaignById(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });

        it("should return error if campaign not found", async () => {
            req.params.campaignId = "1";
            CampaignService.getCampaignById.mockResolvedValue(null);

            await controller.getCampaignById(req, res);

            expect(ErrorReponse).toHaveBeenCalledWith(res, StatusCodes.BAD_REQUEST, expect.any(String));
        });
    });

    describe("getUserCampaignByToken", () => {
        it("should return campaigns", async () => {
            CampaignService.getAllCampaigns.mockResolvedValue([{ id: 1 }]);

            await controller.getUserCampaignByToken(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });

        it("should return error if no campaigns found", async () => {
            CampaignService.getAllCampaigns.mockResolvedValue([]);

            await controller.getUserCampaignByToken(req, res);

            expect(ErrorReponse).toHaveBeenCalled();
        });
    });

    describe("getDeviceTypes", () => {
        it("should return device types", async () => {
            CampaignService.getDeviceTypes.mockResolvedValue([{ deviceType: "TV" }]);

            await controller.getDeviceTypes(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("getLocations", () => {
        it("should return locations", async () => {
            CampaignService.getLocations.mockResolvedValue([{ id: 1 }]);

            await controller.getLocations(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("getProductTypes", () => {
        it("should return product types", async () => {
            CampaignService.getProductTypes.mockResolvedValue([{ product_type: "Shoes" }]);

            await controller.getProductTypes(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("updateCampaign", () => {
        it("should update campaign and return success", async () => {
            req.params.id = "123";
            CampaignService.updateCampaign.mockResolvedValue({ id: "123" });

            await controller.updateCampaign(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("deleteCampaign", () => {
        it("should delete campaign and return success", async () => {
            req.params.id = "1";

            await controller.deleteCampaign(req, res);

            expect(SuccessReposnse).toHaveBeenCalledWith(res, expect.any(String), StatusCodes.OK, null);
        });
    });

    describe("calculateBaseCost", () => {
        it("should calculate base cost and return response", async () => {
            req.body = { adDevices: [], productType: "", targetRegions: [] };
            CampaignService.calculateBaseCost.mockResolvedValue(200);

            await controller.calculateBaseCost(req, res);

            expect(SuccessReposnse).toHaveBeenCalled();
        });
    });

    describe("updateCampaignStatus", () => {
        it("should update status to true and return success response", async () => {
            req.params.id = "123";
            req.body.status = true;
            const mockCampaign = { id: "123", campaignName: "Test Campaign", status: true };

            CampaignService.updateCampaignStatus.mockResolvedValue(mockCampaign);

            await controller.updateCampaignStatus(req, res);

            expect(CampaignService.updateCampaignStatus).toHaveBeenCalledWith("123", true);
            expect(SuccessReposnse).toHaveBeenCalledWith(
                res,
                "Test Campaign Ad Activated successfully",
                200,
                null
            );
        });

        it("should update status to false and return success response", async () => {
            req.params.id = "456";
            req.body.status = false;
            const mockCampaign = { id: "456", campaignName: "Demo Campaign", status: false };

            CampaignService.updateCampaignStatus.mockResolvedValue(mockCampaign);

            await controller.updateCampaignStatus(req, res);

            expect(CampaignService.updateCampaignStatus).toHaveBeenCalledWith("456", false);
            expect(SuccessReposnse).toHaveBeenCalledWith(
                res,
                "Demo Campaign Ad Deactivated successfully",
                200,
                null
            );
        });

        it("should return NOT_FOUND if campaign is not found", async () => {
            req.params.id = "789";
            req.body.status = true;
            CampaignService.updateCampaignStatus.mockResolvedValue(null);

            await controller.updateCampaignStatus(req, res);

            expect(ErrorReponse).toHaveBeenCalledWith(
                res,
                StatusCodes.NOT_FOUND,
                "Unable To Update Campaign Status"
            );
        });
    });
});