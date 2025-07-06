const express = require('express');
const { CampaignController } = require('../../controllers');
const { VerifyToken, UploadFileCampaign, ValidateCampaign } = require('../../middlewares');


const router = express.Router();



/* campaign routes */
router.post('/createCampaign', VerifyToken, UploadFileCampaign.upload.array('productImages',10), CampaignController.createCampaign);
router.put('/:id/status', VerifyToken,CampaignController.updateCampaignStatus);
router.get('/:campaignId/getCampaign',VerifyToken, CampaignController.getCampaignById);
router.get('/getUserCampaign', VerifyToken, CampaignController.getUserCampaignByToken);
router.delete('/:campaignId/deleteCampaign', VerifyToken,CampaignController.deleteCampaign);
router.post('/baseCost', CampaignController.calculateBaseCost);


router.get('/dropdown/devices', CampaignController.getDeviceTypes);
router.get('/dropdown/products', CampaignController.getProductTypes);
router.get('/dropdown/locations', CampaignController.getLocations);

router.put('/:id/updateCampaign', VerifyToken, UploadFileCampaign.upload.array('productFiles',10), CampaignController.updateCampaign);


module.exports = router;