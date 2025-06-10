const crudRepository = require("./crud-repository");
const {Device} = require('../models');
class DeviceRepository  extends crudRepository{
    constructor()
    {
        super(Device);
    }
}

module.exports = DeviceRepository;