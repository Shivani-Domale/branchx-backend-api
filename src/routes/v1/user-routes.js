const express = require('express');
const router = express.Router();


const { UserController } = require('../../controllers');
const { ValidateUser } = require('../../middlewares');

router.post('/createUser',ValidateUser , UserController.createUser);


module.exports = router;
