const express = require('express');
const { CampaignController } = require('../../controllers');
const { upload } = require('../../middlewares/upload-middleware');
const validateCampaign = require('../../middlewares/validate-campaign');


const router = express.Router();


router.post('/createCampaign', upload.single('creativeFile'), validateCampaign, CampaignController.createCampaign);
router.get('/getCampaigns', CampaignController.getCampaigns);
router.put('/:id/status', CampaignController.updateCampaignStatus);

module.exports = router;