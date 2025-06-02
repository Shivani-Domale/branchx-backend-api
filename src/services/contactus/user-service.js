
const UserRepository = require('../../repositories/user-repository');
const sendEmail = require('../../utils/send-Email');



const userService = new UserRepository();
const createUser = async (userData) => {
  try {
    // Create a new user in the database
    const user = await userService.create(userData);
    
    // Send notification email on new contact form submission
    await sendEmail(user);
    
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};


module.exports = {
  createUser,
};