const crudRepository = require("./crud-repository");
const { Device } = require('../models');
const { Op } = require("sequelize");

class DeviceRepository extends crudRepository {
    constructor() {
        super(Device);
    }
async findByDeviceTypes(deviceNames) {
  return await this.model.findAll({
    where: {
      deviceName: {
        [Op.in]: deviceNames.map(p => p.trim())
      }
    }
  });
}

    async getAll() {
        return await this.model.findAll();
    }
    async findByCities(cityNames = []) {
    try {
      return await this.model.findAll({
        where: {
          city: cityNames
        }
      });
    } catch (error) {
      console.error("Error in findByCities:", error);
      throw error;
    }
  }

}

module.exports = DeviceRepository;
