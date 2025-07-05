const express = require('express');
const router = express.Router();


const { UserController } = require('../../controllers');
const LoginUserController = require('../../controllers/users/user-controller');
const { authenticateToken } = require('../../middlewares/auth');


router.post('/createUser', UserController.createUser);
router.get('/myProfile', authenticateToken, LoginUserController.myProfile);
router.put('/editProfile', authenticateToken, LoginUserController.editProfile);



module.exports = router;
