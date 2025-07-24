const crudRepository = require("./crud-repository");
const { Location } = require('../models');
const { Op } = require("sequelize");

class LocationRepository extends crudRepository {
    constructor() {
        super(Location);
    }

    async findByCities(cityNames) {
        return await this.model.findAll({
            where: {
                city: {
                    [Op.in]: cityNames.map(city => city.trim())
                }
            },
            order: [['createdAt', 'DESC']]
        });
    }

    async getAll() {
        return await this.model.findAll({
            order: [['createdAt', 'DESC']]
        });
    }

    async getLocationWithDevices(cityName) {
        return await this.model.findOne({
            where: { city: cityName },
            include: [{
                model: Device,
                attributes: ['deviceType', 'price', 'availableCount'],
            }],
            order: [['createdAt', 'DESC']]
        });
    }

     async findByDeviceTypes(deviceTypes = []) {
    try {
      return await this.model.findAll({
        where: {
          deviceType: deviceTypes
        },
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error("Error in findByDeviceTypes:", error);
      throw error;
    }
  }

}

module.exports = LocationRepository;
