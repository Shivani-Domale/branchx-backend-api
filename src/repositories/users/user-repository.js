const { User } = require('../../models');
const crudRepository = require('../crud-repository');

class UserRepository extends crudRepository {
  constructor() {
    super(User);
  }

  async findUserById(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error in findUserById:', error.message);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ where: { email } });
    } catch (error) {
      console.error('Error in findUserByEmail:', error.message);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      return await User.update(updateData, { where: { id } });
    } catch (error) {
      console.error('Error in updateUser:', error.message);
      throw error;
    }
  }

  async create(data) {
    try {
      return await User.create(data);
    } catch (error) {
      console.error('Error in create:', error.message);
      throw error;
    }
  }
}

// ✅ Only export the class
module.exports = UserRepository;
