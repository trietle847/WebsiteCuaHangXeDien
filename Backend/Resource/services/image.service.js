const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const ImageModel = require("../models/image.model");
const { title } = require("process");
const { url } = require("inspector");

class ImageService {
  async createImage(data, file) {
    const image = await ImageModel.create({
      ...data,
      url: `/uploads/${file.filename}`,
    });
    return image;
  }

  async updateImage(id, data, file) {
    const image = await ImageModel.findByPk(id);

    if (!image) {
      throw new Error("Không tìm thấy ảnh");
    }

    const oldPath = path.join(__dirname, "..", image.url);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    await image.update({
      ...data,
      url: `/uploads/${file.filename}`,
    });
    return image;
  }

  async deleteImage(imageId) {
    const image = await ImageModel.findByPk(imageId);

    const filePath = path.join(__dirname, "..", image.url);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(error);
    }

    await image.destroy();
    return {
      message: "Xóa ảnh thành công",
    };
  }

  async getAllImage() {
    const images = await ImageModel.findAll();
    return images;
  }

  async getImageById(productId) {
    const image = await ImageModel.findAll({
      where: { product_id: productId },
    });
    return image;
  }

  async createImages(files,productColors) {
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

    const images = await ImageModel.bulkCreate(imagesToCreate);
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
        try {
          fs.unlinkSync(filePath);
          fileDeleted++;
        } catch (err) {
          fileFailed++;
          console.log("Lỗi khi xóa ảnh:", filePath);
          console.error(`Lỗi xóa file ảnh ${filePath}:`, err.message);
          throw err
        }
      }
    }

    const imageIds = images.map((img) => img.image_id);
    console.log("image ids:", imageIds);
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
