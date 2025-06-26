const crudRepository = require("./crud-repository");
const { Device } = require('../models');
const { Op } = require("sequelize");

class DeviceRepository extends crudRepository {
    constructor() {
        super(Device);
    }

    async findByDeviceTypes(deviceTypes) {
        return await this.model.findAll({
            where: {
                deviceType: {
                    [Op.in]: deviceTypes.map(p => p.trim())
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
