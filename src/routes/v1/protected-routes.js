const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth');

router.get('/advertiser-area', authenticateToken, authorizeRoles('advertiser'), (req, res) => {
  res.json({ msg: 'Welcome advertiser!' });
});

router.get('/retailer-area', authenticateToken, authorizeRoles('retailer'), (req, res) => {
  res.json({ msg: 'Welcome retailer!' });
});

router.get('/distributor-area', authenticateToken, authorizeRoles('distributor'), (req, res) => {
  res.json({ msg: 'Welcome distributor!' });
});

module.exports = router;
