const express = require('express');
const router = express.Router();

const CampaignRoutes = require('./campaign-routes');

router.use('/campaign', CampaignRoutes);

module.exports = router;