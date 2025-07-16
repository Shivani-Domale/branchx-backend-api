const express = require('express');
const router = express.Router();
const {
  loginUser,
  forgotPassword,
  logoutUser,
  resetPasswordWithOldPassword,
  resetPasswordWithOtp,
} = require('../../controllers/auth/login-user');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');
const checkBlacklistedToken = require('../../middlewares/check-blacklist');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized – Invalid credentials
 *       403:
 *         description: Forbidden – Account not approved
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using old password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request – Missing fields or invalid current password
 */
router.post('/reset-password', authenticateToken, resetPasswordWithOldPassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send OTP for forgotten password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email successfully
 *       400:
 *         description: Bad request – Missing email or failed to send OTP
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password-otp:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request – Missing fields or invalid OTP
 */
router.post('/reset-password-otp', resetPasswordWithOtp);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized – No token provided
 *       500:
 *         description: Internal server error
 */
router.post('/logout', checkBlacklistedToken, logoutUser);


// router.get(
//   '/Advertiser/dashboard',
//   authenticateToken,
//   authorizeRoles('advertiser', 'retailer'),
//   (req, res) => {
//     res.send('Welcome Advertiser or Retailer');
//   }
// );

module.exports = router;
