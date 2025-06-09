const express = require('express');
const router = express.Router();
const { LoginUserController } = require('../../controllers');

router.post('/login', LoginUserController.loginUser);
module.exports = router;