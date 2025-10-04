const BaseService = require("./baseService");
const ProductModel = require("../models/product.model");

class ProductService extends BaseService {
  constructor() {
    super(ProductModel, "sản phẩm");
  }

  // Override create để thêm logic kiểm tra trùng tên
  async create(data) {
    const exist = await this.model.findOne({
      where: { name: data.name },
    });

    if (exist) {
      throw new Error("Sản phẩm đã tồn tại");
    }

    return await super.create(data);
  }

  // Thêm method tìm kiếm riêng
  async findByName(name) {
    const { Op } = require("sequelize");
    const sequelize = require("sequelize");

    const products = await this.model.findAll({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    return products;
  }
}

module.exports = new ProductService();
