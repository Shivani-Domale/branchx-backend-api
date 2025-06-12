const express = require('express');
const { CampaignController } = require('../../controllers');
const { VerifyToken, UploadFileCampaign } = require('../../middlewares');


const router = express.Router();



/* campaign routes */
router.post('/createCampaign',VerifyToken, UploadFileCampaign.upload.single('creativeFile'), CampaignController.createCampaign);
//router.get('/getCampaigns', VerifyToken,CampaignController.getCampaigns);
router.put('/:id/status', CampaignController.updateCampaignStatus);
router.get('/:campaignId/getCampaign',CampaignController.getCampaignById);
router.get('/getUserCampaign',VerifyToken,CampaignController.getUserCampaignByToken);
router.delete('/:id/deleteCampaign',CampaignController.deleteCampaign);

router.get('/dropdown/devices', VerifyToken, CampaignController.getDeviceTypes);
router.get('/dropdown/products', VerifyToken, CampaignController.getProductTypes);
router.get('/dropdown/locations', VerifyToken, CampaignController.getLocations);

router.put('/:id/updateCampaign', VerifyToken, UploadFileCampaign.upload.single('creativeFile'), CampaignController.updateCampaign);


module.exports = router;