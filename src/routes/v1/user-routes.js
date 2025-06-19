const express = require('express');
const router = express.Router();


const { UserController } = require('../../controllers');
const { ValidateUser } = require('../../middlewares');
const  LoginUserController  = require('../../controllers/users/user-controller');
const { authenticateToken } = require('../../middlewares/auth');


router.post('/createUser',ValidateUser , UserController.createUser);
router.get('/myProfile', authenticateToken, LoginUserController.myProfile);
router.put('/editProfile', authenticateToken,  LoginUserController.editProfile);



module.exports = router;
