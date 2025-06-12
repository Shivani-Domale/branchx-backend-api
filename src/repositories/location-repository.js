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
            }
        });
    }

    async getAll() {
        return await this.model.findAll();
    }

    async getLocationWithDevices(cityName) {
    return await this.model.findOne({
        where: { city: cityName },
        include: [{
            model: Device,
            attributes: ['deviceType', 'price', 'availableCount'],
        }]
    });
}

}

module.exports = LocationRepository;
