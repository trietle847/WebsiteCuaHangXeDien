const ColorModel = require("../models/color.model");
class ColorService {
  async createColor(data) {
    const color = await ColorModel.create(data);
    return color;
  }

  async deleteColor(colorId) {
    const color = await ColorModel.findByPk(colorId);

    if (!color) throw new Error("Không tồn tại sản phẩm này");

    await color.destroy()

    return {
        message: "Xóa thành công"
    }
  }

  async getAllColor() {
    const colors = await ColorModel.findAll()

    return colors
  }
}

module.exports = new ColorService();
