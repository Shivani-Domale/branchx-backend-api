'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demographic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Demographic.init({
    ageRange: DataTypes.STRING,
    buyers: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Demographic',
  });
  return Demographic;
};