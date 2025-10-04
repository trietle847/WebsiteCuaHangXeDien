const FavouriteModel = require("../models/favourite.model");
const ProductModel = require("../models/product.model");
const BaseService = require("./baseService");

class FavouriteService extends BaseService {
  async addProductToFavourite(userId, productId) {
    const favourite = await FavouriteModel.findOne({
      where: { user_id: userId },
    });

    const product = await ProductModel.findByPk(productId);
    if (!productId) {
      throw new Error("không thấy sp");
    }
    await favourite.addProduct(product);

    return {
      message: "thêm sản phẩm vào danh sách yêu thích thành công",
    };
  }

  async getFavouriteProduct(userId) {
    const favourite = await FavouriteModel.findOne({
      where: { user_id: userId },
      include: [
        {
          model: ProductModel,
          through: { attributes: [] },
        },
      ],
    });
    console.log(favourite.Products);
    if (!favourite) {
      throw new Error("Danh sách yêu thích không tồn tại");
    }

    const products = await favourite.getProducts({
      joinTableAttributes: [],
    });
    return products;
  }

  async deleteProductInFavourite(userId, productId) {
    const favourite = await FavouriteModel.findOne({
      where: { user_id: userId },
      include: [
        {
          model: ProductModel,
          through: { attributes: [] },
        },
      ],
    });

    if (!favourite) {
      throw new Error("không tồn tại danh sách yêu thích");
    }
    const product = await ProductModel.findByPk(productId);

    if (!product) {
      throw new Error("không tồn tại sản phẩm");
    }
    
    await favourite.removeProduct(product);

    return { message: "Đã xóa sản phẩm khỏi danh sách yêu thích" };
  }
}

module.exports = new FavouriteService();
