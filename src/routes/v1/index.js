const express = require('express');
const router = express.Router();

const CampaignRoutes = require('./campaign-routes');
const UserRoutes = require('./user-routes');
const RetailerRoutes = require('./retailer-routes')

router.use('/campaign', CampaignRoutes);
router.use('/users', UserRoutes);
router.use('/retailers', RetailerRoutes);


module.exports = router;