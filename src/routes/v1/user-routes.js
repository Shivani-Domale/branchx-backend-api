const express = require('express');
const router = express.Router();


const { UserController } = require('../../controllers');
const { ValidateUser } = require('../../middlewares');

router.post('/createUser',ValidateUser , UserController.createUser);


module.exports = router;
// This file defines the user routes for the BranchX Admin API.
// It imports the necessary modules, sets up the router, and defines the route for creating a user.