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
                    [Op.in]: deviceTypes.map(type => type.trim())
                }
            }
        });
    }

    async getAll() {
        return await this.model.findAll();
    }

}

module.exports = DeviceRepository;
