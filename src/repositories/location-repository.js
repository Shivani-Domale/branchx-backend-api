const crudRepository = require("./crud-repository");
const {Location} = require('../models');
class LocationRepository extends  crudRepository{
    constructor()
    {
        super(Location);
    }
}