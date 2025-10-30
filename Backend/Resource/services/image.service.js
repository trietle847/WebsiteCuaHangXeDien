const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const ImageModel = require("../models/image.model");

class ImageService {
  async createImages(files, productColors, transaction = null) {
    if (!files || files.length === 0) {
      throw new Error("Không có hình ảnh để thêm");
    }

    const imagesToCreate = productColors.flatMap((pc) => {
      const colorImages = files.filter(
        (f) => f.fieldname === `images_${pc.color_id}`
      );

      return colorImages.map((file) => ({
        title: file.originalname,
        productColor_id: pc.productColor_id,
        url: `/uploads/${file.filename}`,
      }));
    });

    const images = await ImageModel.bulkCreate(imagesToCreate, { transaction });
    return images;
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
        fs.unlinkSync(filePath);
        fileDeleted++;
      } else {
        fileFailed++;
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
}

module.exports = new ImageService();
