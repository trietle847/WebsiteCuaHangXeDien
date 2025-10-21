const ProductColorModel = require("../models/productColor.model");
const ImageModel = require("../models/image.model");
const ImageService = require("./image.service");
const { Op } = require("sequelize");

class ProductColorService {
  async addImagesToProductColors(productColorIds, files) {
    const productColors = await ProductColorModel.findAll({
      where: { productColor_id: { [Op.in]: productColorIds } },
    });
    if (!productColors || productColors.length === 0) {
      throw new Error("Không tìm thấy màu sản phẩm");
    }

    await ImageService.createImages(files,productColors);

    return { message: "Thêm hình ảnh vào màu sản phẩm thành công" };
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
    // Xử lý đầu vào rỗng
    if (!productColorIds || productColorIds.length === 0) {
      return {
        message: "Không có gì để xóa",
        deleteResult: { filesDeleted: 0, recordsDeleted: 0 },
      };
    }

    const shouldCommit = !transaction;
    if (!transaction) {
      transaction = await ProductColorModel.sequelize.transaction();
    }

    try {
      // Tìm tất cả các ảnh liên quan
      const images = await ImageModel.findAll({
        where: { productColor_id: { [Op.in]: productColorIds } },
        transaction,
      });

      let deleteResult = { filesDeleted: 0, recordsDeleted: 0 };
      if (images.length > 0) {
        // Xóa các ảnh trước
        deleteResult = await ImageService.deleteImages(images, transaction);
      }

      const deletedRows = await ProductColorModel.destroy({
        where: {
          productColor_id: { [Op.in]: productColorIds },
        },
        transaction,
      });

      if (deletedRows === 0) {
        throw new Error(
          "Không tìm thấy màu sản phẩm nào để xóa (ID không khớp)."
        );
      }

      // Commit nếu transaction được tạo trong hàm này
      if (shouldCommit) {
        await transaction.commit();
      }

      return { message: "Xóa màu sản phẩm thành công", deleteResult };
    } catch (error) {
      // Rollback nếu có lỗi xảy ra
      if (shouldCommit) {
        await transaction.rollback();
      }
      throw error; // Ném lỗi ra để service cha xử lý
    }
  }
}

module.exports = new ProductColorService();
