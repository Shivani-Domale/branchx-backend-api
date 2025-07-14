const express = require('express');
const { CampaignController } = require('../../controllers');
const { VerifyToken, UploadFileCampaign } = require('../../middlewares');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Campaign management APIs
 */

/**
 * @swagger
 * /campaign/createCampaign:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               productFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Campaign created successfully
 */
router.post(
  '/createCampaign',
  VerifyToken,
  UploadFileCampaign.upload.array('productFiles', 10),
  CampaignController.createCampaign
);

/**
 * @swagger
 * /campaign/{id}/status:
 *   put:
 *     summary: Update campaign status
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Campaign status updated
 */
router.put('/:id/status', VerifyToken, CampaignController.updateCampaignStatus);

/**
 * @swagger
 * /campaign/{campaignId}/getCampaign:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: campaignId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details fetched
 */
router.get('/:campaignId/getCampaign', VerifyToken, CampaignController.getCampaignById);

/**
 * @swagger
 * /campaign/getUserCampaign:
 *   get:
 *     summary: Get logged-in user's campaigns
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get('/getUserCampaign', VerifyToken, CampaignController.getUserCampaignByToken);

/**
 * @swagger
 * /campaign/{campaignId}/deleteCampaign:
 *   delete:
 *     summary: Delete campaign by ID
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: campaignId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted
 */
router.delete('/:campaignId/deleteCampaign', VerifyToken, CampaignController.deleteCampaign);

/**
 * @swagger
 * /campaign/baseCost:
 *   post:
 *     summary: Calculate base cost for a campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               targetRegions:
 *                 type: array
 *                 items:
 *                   type: string
 *               adDevices:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Base cost calculated
 */
router.post('/baseCost', CampaignController.calculateBaseCost);

/**
 * @swagger
 * /campaign/dropdown/devices:
 *   get:
 *     summary: Get available device types
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of devices
 */
router.get('/dropdown/devices', CampaignController.getDeviceTypes);

/**
 * @swagger
 * /campaign/dropdown/products:
 *   get:
 *     summary: Get available product types
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/dropdown/products', CampaignController.getProductTypes);

/**
 * @swagger
 * /campaign/dropdown/locations:
 *   get:
 *     summary: Get available locations
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: List of locations
 */
router.get('/dropdown/locations', CampaignController.getLocations);

/**
 * @swagger
 * /campaign/{id}/updateCampaign:
 *   put:
 *     summary: Update campaign with files
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Campaign updated
 */
router.put(
  '/:id/updateCampaign',
  VerifyToken,
  UploadFileCampaign.upload.array('productFiles', 10),
  CampaignController.updateCampaign
);

module.exports = router;
