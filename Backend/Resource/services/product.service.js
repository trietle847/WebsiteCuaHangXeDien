const BaseService = require("./baseService");
const ProductModel = require("../models/product.model");
const ImageModel = require("../models/image.model");

class ProductService extends BaseService {
  constructor() {
    // Truyền includes vào BaseService để tự động lấy images khi query
    super(ProductModel, "sản phẩm", [
      {
        model: ImageModel,
        as: "images", // ← Phải khớp với alias trong associations.js
        attributes: ["image_id", "url"], // Chọn các trường cần lấy
      },
    ]);
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

  // Thêm images cho product
  async addImages(productId, uploadedImages) {
    const imageRecords = uploadedImages.map((img) => ({
      product_id: productId,
      url: img.imageUrl,
      alt_text: img.originalName || null,
    }));

    await ImageModel.bulkCreate(imageRecords);
    return imageRecords;
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
