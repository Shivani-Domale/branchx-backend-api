const UserRepository = require('../../repositories/users/user-repository');
const { User } = require('../../models');                              


const userRepository = new UserRepository();

const getUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findUserByEmail = async (email) => {
  return await userRepository.findUserByEmail(email);
};

const updateUserProfile = async (userId, role, updateData, roleFields) => {
  try {
    const allowedFields = roleFields[role];
    if (!allowedFields) throw new Error('Invalid role');

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    await userRepository.updateUser(userId, filteredData);
    const updatedUser = await userRepository.findUserById(userId);

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  } catch (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }
};

module.exports = {
  getUserById,
  findUserByEmail,
  updateUserProfile,
};
