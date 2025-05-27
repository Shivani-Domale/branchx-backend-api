const express = require('express');
const { CampaignController } = require('../../controllers');


const router = express.Router();


router.post('/createCampaign',CampaignController.createCampaign);


module.exports = router;