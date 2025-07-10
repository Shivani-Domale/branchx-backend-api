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

router.post('/login', loginUser);
router.post('/reset-password', authenticateToken,resetPasswordWithOldPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password-otp', resetPasswordWithOtp);
router.post('/logout', checkBlacklistedToken, logoutUser);




router.get('/distributor/dashboard',
  authenticateToken,
  authorizeRoles('distributor'),
  (req, res) => {
    res.send('Welcome Distributor');
  }
);

router.get('/Advertiser/dashboard',
  authenticateToken,
  authorizeRoles('advertiser', 'retailer'),
  (req, res) => {
    res.send('Welcome Advertiser or Retailer');
  }
);

module.exports = router;
