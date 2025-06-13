const express = require('express');
const { CampaignController } = require('../../controllers');
const { VerifyToken, UploadFileCampaign } = require('../../middlewares');


const router = express.Router();



/* campaign routes */
router.post('/createCampaign',VerifyToken, UploadFileCampaign.upload.single('creativeFile'), CampaignController.createCampaign);
router.put('/:id/status', CampaignController.updateCampaignStatus);
router.get('/:campaignId/getCampaign',CampaignController.getCampaignById);
router.get('/getUserCampaign',VerifyToken,CampaignController.getUserCampaignByToken);
router.delete('/:id/deleteCampaign',CampaignController.deleteCampaign);
router.post('/baseCost',CampaignController.calculateBaseCost);


router.get('/dropdown/devices', CampaignController.getDeviceTypes);
router.get('/dropdown/products', CampaignController.getProductTypes);
router.get('/dropdown/locations', CampaignController.getLocations);

router.put('/:id/updateCampaign', VerifyToken, UploadFileCampaign.upload.single('creativeFile'), CampaignController.updateCampaign);


module.exports = router;