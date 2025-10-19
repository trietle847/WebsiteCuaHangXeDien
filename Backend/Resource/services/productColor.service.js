const ProductColorModel = require("../models/productColor.model");
const ImageModel = require("../models/image.model");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

class ProductColorService {
  async addImagesToProductColors(productColorIds, files) {
    const productColors = await ProductColorModel.findAll({
      where: { productColor_id: { [Op.in]: productColorIds } },
    });
    if (!productColors || productColors.length === 0) {
      throw new Error("Không tìm thấy màu sản phẩm");
    }

    if (!files || files.length === 0) {
      throw new Error("Không có hình ảnh để thêm");
    }

    // Sử dụng flatMap để tạo ra một mảng phẳng duy nhất
    const imagesToCreate = productColors.flatMap((pc) => {
      // 1. Lọc ra các file cho màu hiện tại
      const colorImages = files.filter(
        (f) => f.fieldname === `images_${pc.color_id}`
      );

      // 2. Map các file này thành object ảnh, flatMap sẽ tự động gộp kết quả
      return colorImages.map((file) => ({
        title: file.originalname,
        productColor_id: pc.productColor_id,
        url: `/uploads/${file.filename}`,
      }));
    });

    console.log("Chuẩn bị tạo ảnh");
    await ImageModel.bulkCreate(imagesToCreate);

    return { message: "Thêm hình ảnh vào màu sản phẩm thành công" };
  }

  async deleteImages(images, transaction = null) {
    if (!images || images.length === 0)
      return {
        fileDeleted: 0,
        recordsDeleted: 0,
      };

    let fileDeleted = 0;
    let fileFailed = 0;

    for (const img of images) {
      const filePath = path.resolve(
        __dirname,
        "../../",
        img.url.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          fileDeleted++;
        } catch (err) {
          fileFailed++;
          console.error(`Lỗi xóa file ảnh ${filePath}:`, err.message);
        }
      }
    }

    const imageIds = images.map((img) => img.image_id);
    const recordsDeleted = await ImageModel.destroy({
      where: { image_id: { [Op.in]: imageIds } },
      transaction,
    });

    return {
      fileDeleted,
      fileFailed,
      recordsDeleted,
    };
  }

  async createProductColors(colorIds, product_id) {
    if (!colorIds || colorIds.length === 0) {
      throw new Error("Không có màu sản phẩm để tạo");
    }

    const productColors = ProductColorModel.bulkCreate(
      colorIds.map((color_id) => ({
        color_id,
        product_id,
      }))
    );

    return productColors;
  }

  async deleteProductColors(productColorIds, transaction = null) {
    const shouldCommit = !transaction;
    if (!transaction) {
      transaction = await ProductColorModel.sequelize.transaction();
    }

    const productColors = await ProductColorModel.findAll({
      where: {
        productColor_id: {[Op.in]: productColorIds}
      }
    })

    if (!productColors || productColors.length === 0 ) {
      throw new Error("Không tìm thấy màu sản phẩm nào cần xóa");
    }
    const images = await ImageModel.findAll({
      where: { productColor_id: {[Op.in]: productColorIds} },
      transaction,
    });

    const deleteResult = await this.deleteImages(images, transaction);

    await productColors.destroy({ transaction });

    if (shouldCommit) {
      await transaction.commit();
    }

    return { message: "Xóa màu sản phẩm thành công", deleteResult };
  }
}

module.exports = new ProductColorService();
