const logger = require('../../config/logger');
const { userService } = require('../../services/contactus');
const sendEmail = require('../../utils/send-Email');
const { User } = require('../../models');
const { SuccessReposnse } = require('../../utils');
const { StatusCodes } = require('http-status-codes');
const errorResponse = require('../../utils/errorHandler/errorReponse');

exports.createUser = async (req, res, next) => {
  try {
    const email = req?.body?.email;

    if (!email) {
      errorResponse(res, StatusCodes.BAD_REQUEST, "Email is required", null);
      return;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      errorResponse(res, StatusCodes.NOT_ACCEPTABLE, "Email Already Exists !!", null);
      return;
    }

    const user = await userService.createUser(req?.body);
    logger?.info?.(`User created: ${user?.id} - ${user?.email}`);

    // Send notification email
    await sendEmail(user);
    logger?.info?.(`Notification email sent for user: ${user?.id}`);

    SuccessReposnse(res, "User Created SuccessFully !", StatusCodes.CREATED, null);
  } catch (error) {
    logger?.error?.(`Error in createUser: ${error?.message}`);
    next(error);
  }
};
