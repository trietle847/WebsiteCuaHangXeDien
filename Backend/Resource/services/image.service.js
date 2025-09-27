const ImageModel = require("../models/image.model");

class ImageService {
  async createImage(data) {
    const image = await ImageModel.create(data);
    return image;
  }

  async updateImage(imageId, data) {
    const image = await ImageModel.findByPk(imageId);

    if (!image) {
        throw new Error("Không tìm thấy ảnh")
    }
    await image.update(data);
    return image
  }

  async deleteImage(imageId) {
    const image = await ImageModel.findByPk(imageId);

    await image.destroy();
    return {
      message: "Xóa ảnh thành công",
    };
  }

  async getAllImage() {
    const images = await ImageModel.findAll()
    return images
  }

  async getImageById(imageId) {
    const image = await ImageModel.findByPk(imageId)
    return image
  }
}

module.exports = new ImageService();
