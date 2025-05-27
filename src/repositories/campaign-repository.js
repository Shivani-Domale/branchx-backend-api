const {Campaign} = require("../models");
const crudRepository = require("./crud-repository");

class CampaignRepository extends crudRepository{
 constructor() {
        super(Campaign);
    }

}


module.exports = CampaignRepository;