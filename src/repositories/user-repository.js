const { User } = require('../models');
const crudRepository = require('./crud-repository');

class UserRepository extends crudRepository{
  constructor() {
    super(User);
  }
}


module.exports = UserRepository;