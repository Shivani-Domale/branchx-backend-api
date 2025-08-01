const express = require('express');
const router = express.Router();

const { UserController } = require('../../controllers');
const LoginUserController = require('../../controllers/users/user-controller');
const { authenticateToken } = require('../../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related APIs
 */

/**
 * @swagger
 * /users/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request – Email is required
 *       406:
 *         description: Not acceptable – Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/createUser', UserController.createUser);

/**
 * @swagger
 * /users/myProfile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/myProfile', authenticateToken, LoginUserController.myProfile);

/**
 * @swagger
 * /users/editProfile:
 *   put:
 *     summary: Edit logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request – Email already exists
 *       500:
 *         description: Internal server error
 */
router.put('/editProfile', authenticateToken, LoginUserController.editProfile);

module.exports = router;
