const express = require('express');
const router = express.Router();
const authController = require('../../controllers/login/auth-controller');


router.post('/login', authController.login);

module.exports = router;
// This code defines a route for user login in an Express.js application.