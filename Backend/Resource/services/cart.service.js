const CartModel = require("../models/cart.model");
const CartItemModel = require("../models/cartItem.model");
const ProductModel = require("../models/product.model");
const ProductColorModel = require("../models/productColor.model");
const ProductDetailModel = require("../models/productDetail.model");
const ImageModel = require("../models/image.model");
const ColorModel = require("../models/color.model");

class CartService {
  async createCart(user_id) {
    const cart = await CartModel.create({
      user_id,
    });
    return cart;
  }

  async addItemToCart(userId, productColor_id, quantity) {
    const cart = await CartModel.findOne({
      where: { user_id: userId },
    });

    const productColor = ProductColorModel.findByPk(productColor_id);
    if (!productColor) {
      throw new Error("không tìm thấy sản phẩm");
    }

    const cartItem = await CartItemModel.create({
      productColor_id,
      quantity,
    });

    await cart.addItems(cartItem);

    return {
      message: "thêm sản phẩm vào giỏ hàng thành công",
    };
  }

  async getCart(userId) {

    const cart = await CartModel.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItemModel,
          as: "Items",
          include: [
            {
              model: ProductColorModel,
              as: "ProductColor",
              include: [
                {
                  model: Product,
                  as: "Product",
                  attributes: ["product_id", "name", "price"],
                },
                {
                  model: ColorModel,
                  as: "Color",
                },
                {
                  model: ImageModel,
                  as: "ColorImages"
                }
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      // Vì một lý do nào đó mà người dùng không có giỏ hàng thì tạo mới
      const newCart = await this.createCart(userId);
      return newCart;
    }

    return cart;
  }

  async deleteItemInCart(cartItem_id) {
    const cartItem = await CartItemModel.findByPk(cartItem_id);

    await cartItem.destroy();

    return { message: "Đã xóa sản phẩm khỏi giỏ hàng" };
  }
}

module.exports = new CartService();
