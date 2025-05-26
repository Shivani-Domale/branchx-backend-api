const { User } = require('../models');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Create new user
const createUser = async (data) => {
  return await User.create(data);
};

module.exports = {
  findUserByEmail,
  createUser,
};
