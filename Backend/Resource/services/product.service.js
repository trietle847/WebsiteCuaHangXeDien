const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const ProductModel = require("../models/product.model");
const sequelize = require("sequelize");
const ImageModel = require("../models/image.model");

class ProductService {
  async createProduct(data, files) {
    const product = await ProductModel.create(data);

    if (files) {
      const images = files.map((file) => ({
        title: file.originalname,
        url: `/uploads/${file.filename}`,
        product_id: product.product_id,
      }));

      await ImageModel.bulkCreate(images);
    }

    const result = await ProductModel.findByPk(product.product_id, {
      include: [{ model: ImageModel, as: "images" }],
    });
    return result;
  }

  async deleteProduct(productId) {
    const product = await ProductModel.findByPk(productId);

    if (!product) throw new Error("khồng tồn tại sản phẩm này");

    const images = await ImageModel.findAll({
      where: { product_id: productId },
    });
    for (const img of images) {
      const filePath = path.resolve(
        __dirname,
        "../../",
        img.url.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Lỗi xóa file ảnh${filePath}:`, err.message);
        }
      }
    }
    //  xóa sp => tự xóa ảnh của sản phẩm đó trong csdl

    await product.destroy();

    return {
      message: "Xóa sản phẩm thành công",
    };
  }

  async updateProduct(productId, data, files) {
    
    const product = await ProductModel.findByPk(productId, {
      include: [{ model: ImageModel, as: "images" }],
    });

    if (!product) {
      throw new Error("Không có sản phẩm");
    }
    // Cập nhật sản phẩm thông tin từ body
    await product.update(data);

    // lấy ds ảnh cón lại
    const deleteIds = data.deleteImageIds ? JSON.parse(data.deleteImageIds) : [];

    //lấy ảnh cũ
    const oldImages = await ImageModel.findAll({
      where: { product_id: productId },
    });

    // xóa ảnh nếu có trong deleteIds
    const imageDeletes = oldImages.filter(
      (img) => deleteIds.includes(img.image_id)
    );

    // xóa file vật lý và trong csdl
    for (const img of imageDeletes) {
      const filePath = path.resolve(
        __dirname,
        "../../",
        img.url.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Lỗi xóa file ảnh${filePath}:`, err.message);
        }
      }
      await img.destroy()
    }

    // nếu trong files có ảnh thì thêm ảnh đó vào
    if (files) {
      const newImages = files.map((file) => ({
        title: file.originalname,
        url: `/uploads/${file.filename}`,
        product_id: product.product_id,
      }));

      await ImageModel.bulkCreate(newImages);
    }

     const updated = await ProductModel.findByPk(productId, {
       include: [{ model: ImageModel, as: "images" }],
     });

     return updated;
  }

  async getProductById(productId) {
    const product = ProductModel.findByPk(productId, {
      include: [{ model: ImageModel, as: "images" }],
    });
    return product;
  }

  async getAllProduct() {
    const products = ProductModel.findAll({
      include: [{model: ImageModel, as: "images"}]
    });

    return products;
  }

  async findProductByName(name) {
    const products = ProductModel.findAll({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("name")), {
        [Op.like]: `%${name.toLowerCase()}%`,
      }),
    });
    return products;
  }

}

module.exports = new ProductService();
