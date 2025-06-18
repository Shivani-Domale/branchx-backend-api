const { User } = require('../models');
const crudRepository = require('./crud-repository');

class UserRepository extends crudRepository {
  constructor() {
    super(User);
  }

  async findUserById(id) {
    return await User.findByPk(id);
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async updateUser(id, updateData) {
    return await User.update(updateData, { where: { id } });
  }

  async create(data) {
    return await User.create(data);
  }
}

module.exports = UserRepository;
