const crudRepository = require("./crud-repository");
const {Product}  = require('../models');

class ProductRepository extends crudRepository{
    constructor()
    {
        super(Product);
    }
}

module.exports = ProductRepository;