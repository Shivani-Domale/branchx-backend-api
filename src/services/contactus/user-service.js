
const UserRepository = require('../../repositories/user-repository');
const sendEmail = require('../../utils/send-Email');



const userService = new UserRepository();
const createUser = async (userData) => {
  try {
    const user = await userService.create(userData);

    user.status = 'PENDING';
    await user.save(); // Save the updated status

    await sendEmail(user);
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};


module.exports = {
  createUser,
};