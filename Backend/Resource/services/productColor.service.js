const ProductColorModel = require("../models/productColor.model");
const ImageModel = require("../models/image.model");
const ImageService = require("./image.service");
const { Op } = require("sequelize");

class ProductColorService {
  async addImagesToProductColors(productColorIds, files, transaction = null) {
    const productColors = await ProductColorModel.findAll({
      where: { productColor_id: { [Op.in]: productColorIds } },
      transaction,
    });

    if (!productColors || productColors.length === 0) {
      throw new Error("Không tìm thấy màu sản phẩm");
    }

    await ImageService.createImages(files, productColors, transaction);

    return { message: "Thêm hình ảnh vào màu sản phẩm thành công" };
  }

  async createProductColors(
    colorIds,
    product_id,
    newQuantities,
    transaction = null
  ) {
    if (!colorIds || colorIds.length === 0) {
      throw new Error("Không có màu sản phẩm để tạo");
    }

    console.log("Creating product colors with IDs:", colorIds);
    console.log("Product ID:", product_id);
    console.log("New quantities:", newQuantities);

    // Bước 1: Kiểm tra màu đã tồn tại (chưa xóa)
    const existingProductColors = await ProductColorModel.findAll({
      where: {
        product_id: parseInt(product_id),
        color_id: { [Op.in]: colorIds },
      },
      transaction,
    });

    const existingColorIds = existingProductColors.map((pc) => pc.color_id);

    // Bước 2: Kiểm tra màu đã bị xóa mềm (paranoid)
    const deletedProductColors = await ProductColorModel.findAll({
      where: {
        product_id: parseInt(product_id),
        color_id: { [Op.in]: colorIds },
      },
      paranoid: false, // Bỏ qua soft delete filter
      transaction,
    });

    const deletedColorIds = deletedProductColors
      .filter((pc) => pc.deletedAt !== null) // Chỉ lấy các record đã xóa
      .map((pc) => pc.color_id);

    // Bước 3: Restore các màu đã xóa
    const colorsToRestore = colorIds.filter((colorId) =>
      deletedColorIds.includes(colorId)
    );

    if (colorsToRestore.length > 0) {

      for (const colorId of colorsToRestore) {
        await ProductColorModel.restore({
          where: {
            product_id: parseInt(product_id),
            color_id: colorId,
          },
          transaction,
        });

        // Update quantity sau khi restore
        await ProductColorModel.update(
          { stock_quantity: newQuantities[`id${colorId}`] || 0 },
          {
            where: {
              product_id: parseInt(product_id),
              color_id: colorId,
            },
            transaction,
          }
        );
      }
    }

    // Bước 4: Tạo màu hoàn toàn mới (chưa từng tồn tại)
    const allExistingColorIds = deletedProductColors.map((pc) => pc.color_id);
    const newColorIds = colorIds.filter(
      (colorId) => !allExistingColorIds.includes(colorId)
    );

    let newProductColors = [];
    if (newColorIds.length > 0) {
      const productColorsToCreate = newColorIds.map((color_id) => ({
        color_id,
        product_id: parseInt(product_id),
        stock_quantity: newQuantities[`id${color_id}`] || 0,
      }));

      try {
        newProductColors = await ProductColorModel.bulkCreate(
          productColorsToCreate,
          { transaction }
        );
      } catch (error) {
        throw error;
      }
    }

    // Bước 5: Lấy lại tất cả màu sau khi restore và create
    const allProductColors = await ProductColorModel.findAll({
      where: {
        product_id: parseInt(product_id),
        color_id: { [Op.in]: colorIds },
      },
      transaction,
    });

    console.log("Final product colors count:", allProductColors.length);
    return allProductColors;
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

  async updateQuantities(updateQuantities, transaction = null) {
    const updatePromises = Object.entries(updateQuantities).map(
      ([key, value]) => {
        const id = key.replace(/^id/, "");

        return ProductColorModel.update(
          { stock_quantity: value },
          {
            where: { productColor_id: id },
            transaction,
          }
        );
      }
    );

    await Promise.all(updatePromises);

    return { message: "Quantities updated successfully." };
  }
}

module.exports = new ProductColorService();
