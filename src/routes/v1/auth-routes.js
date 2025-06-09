const express = require('express');
const router = express.Router();
const { LoginUserController } = require('../../controllers');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

router.post('/login', LoginUserController.loginUser);
module.exports = router;

router.get('/distributor/dashboard',
  authenticateToken,
  authorizeRoles('distributor'),
  (req, res) => {
    res.send('Welcome Distributor');
  }
);

// Advertisers and retailers can access this route
router.get('/Advertiser/dashboard',
  authenticateToken,
  authorizeRoles('advertiser', 'retailer'),
  (req, res) => {
    res.send('Welcome Advertiser or Retailer');
  }
);