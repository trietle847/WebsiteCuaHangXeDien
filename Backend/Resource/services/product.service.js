const { Op } = require("sequelize");
const ProductModel = require("../models/product.model");
const sequelize = require("sequelize")

class ProductService {
  async createProduct(data) {
    const exist = await ProductModel.findOne({
      where: { name: data.name },
    });

    if (exist) {
      throw Error("sản phẩm đã tồn tại");
    }

    const res = await ProductModel.create(data);

    return res;
  }

  async getAllProduct() {
    const products = ProductModel.findAll()

    return products
  }

  async findProductByName(name) {
    const products = ProductModel.findAll({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    return products;
  }

  async deleteProduct(productId) {
    const product = await ProductModel.findByPk(productId)

    if (!product) throw new Error("khồng tồn tại sản phẩm này")

    await product.destroy()

    return {
        message: "xóa sản phẩm thành công"
    }
  }
}

module.exports = new ProductService();
