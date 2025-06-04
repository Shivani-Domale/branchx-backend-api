const logger = require('../../config/logger');
const { userService } = require('../../services/contactus');
const sendEmail = require('../../utils/send-Email');
const { User } = require('../../models'); // Import the User model

exports.createUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check for existing user by email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Proceed to create new user
    console.log("Creating user with data:", req.body);
    const user = await userService.createUser(req.body);
    logger.info(`User created: ${user.id} - ${user.email}`);

    // Send notification email
    await sendEmail(user);
    logger.info(`Notification email sent for user: ${user.id}`);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    logger.error(`Error in createUser: ${error.message}`);
    next(error);
  }
};
