const path = require("path");
const fs = require("fs");
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
}

module.exports = new ImageService();
