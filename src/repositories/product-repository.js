const crudRepository = require("./crud-repository");
const { Product } = require('../models');

class ProductRepository extends crudRepository {
    constructor() {
        super(Product);
    }

    async findIdByProductType(productType) {
        try {
            const product = await this.model.findOne({
                where: {
                    product_type: productType.trim()
                }
            });

            if (!product) {
                throw new Error("Product type not found");
            }

            return product.id;
        } catch (error) {
            throw new Error(`Error fetching product by type: ${error.message}`);
        }
    }
}

module.exports = ProductRepository;
