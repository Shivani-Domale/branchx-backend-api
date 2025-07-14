const express = require('express');
const { RetailerController } = require('../../controllers');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Retailer
 *   description: Retailer-related APIs
 */

/**
 * @swagger
 * /retailers/fetchApproveCampaigns:
 *   get:
 *     summary: Fetch approved campaigns for retailer
 *     tags: [Retailer]
 *     responses:
 *       200:
 *         description: List of approved campaigns
 */
router.get('/fetchApproveCampaigns', RetailerController.fetchApprovedCampaigns);

module.exports = router;