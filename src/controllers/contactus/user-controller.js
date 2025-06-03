
const logger = require('../../config/logger');
const { userService } = require('../../services/contactus');
const sendEmail = require('../../utils/send-Email');

exports.createUser = async (req, res, next) => {
  try {
    console.log("Creating user with data:", req.body);
    const user = await userService.createUser(req.body);
    logger.info(`User created: ${user.id} - ${user.email}`);

    // Send notification email on new contact form submission
    await sendEmail(user);
    logger.info(`Notification email sent for user: ${user.id}`);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error(`Error in createUser: ${error.message}`);
    next(error);
  }
};

