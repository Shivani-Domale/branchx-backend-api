const userService = require('../../services/users/user-service');
const { StatusCodes } = require('http-status-codes');
const logger = require('../../config/logger');
const SuccessReposnse = require('../../utils/errorHandler/successReponse');


const allowedFieldsByRole = {
  retailer: ['fullName', 'phone', 'country', 'state', 'businessName', 'city', 'email'],
  'ad-agency': ['fullName', 'phone', 'businessName', 'email'],
  //distributor: ['fullName', 'phone', 'country', 'state', 'city', 'email']
};

exports.myProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return SuccessReposnse(res, "User not found", StatusCodes.NOT_FOUND, null);
    }

    // Remove sensitive/unwanted fields
    const { message, status, password, ...safeUser } = user.dataValues;

    return SuccessReposnse(res, "User profile fetched successfully", StatusCodes.OK, safeUser);
  } catch (error) {
    logger.error("Error in myProfile: ", error.message);
    next(error);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    console.log(req.body);
    
    const userId = req.user.id;
    const role = req.user.role;
    const updateData = req.body;

    // Check if email already exists and it's not the same user's
    if (updateData.email) {
      const existingUser = await userService.findUserByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        return SuccessReposnse(res, "Email Already Exists !!", StatusCodes.BAD_REQUEST, null);
      }
    }

    const result = await userService.updateUserProfile(userId, role, updateData, allowedFieldsByRole);
    return SuccessReposnse(res, result.message, StatusCodes.OK, result.user);
  } catch (error) {
    logger.error("Error in editProfile: ", error.message);
    next(error);
  }
};
