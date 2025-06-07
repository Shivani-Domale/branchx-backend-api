const express = require('express');
const { CampaignController } = require('../../controllers');
const { upload } = require('../../middlewares/upload-middleware');
const validateCampaign = require('../../middlewares/validate-campaign');
const { VerifyToken } = require('../../middlewares');


const router = express.Router();



/* campaign routes */
router.post('/createCampaign',VerifyToken, upload.single('creativeFile'), CampaignController.createCampaign);
router.get('/getCampaigns', VerifyToken,CampaignController.getCampaigns);
router.put('/:id/status', CampaignController.updateCampaignStatus);
router.get('/:campaignId/getCampaign',CampaignController.getCampaignById);
router.get('/getUserCampaign',VerifyToken,CampaignController.getUserCampaignByToken);

module.exports = router;