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
 *             required:
 *               - campaignName
 *               - brandName
 *               - startDate
 *               - endDate
 *               - productFiles
 *               - targetDevices
 *               - targetRegions
 *             properties:
 *               campaignName:
 *                 type: string
 *               brandName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               baseBid:
 *                 type: number
 *               maxBid:
 *                 type: string
 *               campaignBudget:
 *                 type: string
 *               adType:
 *                 type: string
 *               storeType:
 *                 type: string
 *               duration:
 *                 type: integer
 *               productType:
 *                 type: string
 *               targetDevices:
 *                 type: string
 *                 description: JSON stringified array of device IDs
 *               targetRegions:
 *                 type: string
 *                 description: JSON stringified array of location IDs
 *               productFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Campaign created successfully
 *       400:
 *         description: Bad Request – Missing or invalid fields, or no files provided
 *       401:
 *         description: Unauthorized – User not logged in
 *       415:
 *         description: Unsupported Media Type – Invalid file type
 *       500:
 *         description: Internal Server Error – Something went wrong on the server
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
 *     summary: Update campaign status (activate or deactivate)
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campaign to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: true to activate, false to deactivate
 *     responses:
 *       200:
 *         description: Campaign status updated successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
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
 *         description: ID of the campaign to retrieve
 *     responses:
 *       200:
 *         description: Campaign details fetched successfully
 *       400:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
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
 *       401:
 *         description: Unauthorized – Please login
 *       404:
 *         description: No campaigns found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserCampaign', VerifyToken, CampaignController.getUserCampaignByToken);

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
 *             required:
 *               - productTypes
 *               - targetRegions
 *               - adDevices
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
 *         description: Base cost calculated successfully
 *       400:
 *         description: Bad Request – Missing or invalid input arrays
 *       500:
 *         description: Internal server error
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
 *         description: List of devices fetched successfully
 *       404:
 *         description: No devices found
 *       500:
 *         description: Internal server error
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
 *         description: List of products fetched successfully
 *       404:
 *         description: No product categories found
 *       500:
 *         description: Internal server error
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
 *         description: List of locations fetched successfully
 *       404:
 *         description: No cities found
 *       500:
 *         description: Internal server error
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
 *         description: ID of the campaign to update
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
 *         description: Campaign updated successfully
 *       401:
 *         description: Unauthorized – Please login to continue
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id/updateCampaign',
  VerifyToken,
  UploadFileCampaign.upload.array('productFiles', 10),
  CampaignController.updateCampaign
);


/**
 * @swagger
 * /campaign/{campaignId}/deleteCampaign:
 *   delete:
 *     summary: Delete a campaign (soft delete)
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: campaignId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the campaign to delete
 *     responses:
 *       200:
 *         description: Campaign soft deleted successfully
 *       401:
 *         description: Unauthorized – Please login
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:campaignId/deleteCampaign', VerifyToken, CampaignController.deleteCampaign);


router.post('/createCampaignOrder',CampaignController.createCampaignOrder);


module.exports = router;
