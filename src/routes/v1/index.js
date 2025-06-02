const express = require('express');
const router = express.Router();

const CampaignRoutes = require('./campaign-routes');
const UserRoutes = require('./user-routes');

router.use('/campaign', CampaignRoutes);
router.use('/user', UserRoutes);


module.exports = router;