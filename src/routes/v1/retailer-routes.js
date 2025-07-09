const express = require('express');
const  {RetailerController}  = require('../../controllers');
const router = express.Router();


router.get('/fetchApproveCampaigns',RetailerController.fetchApprovedCampaigns);

module.exports = router;