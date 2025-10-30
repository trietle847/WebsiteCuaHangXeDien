const CartModel = require("../models/cart.model");
const CartItemModel = require("../models/cartItem.model");
const ProductModel = require("../models/product.model");
const ProductColorModel = require("../models/productColor.model");
const ProductDetailModel = require("../models/productDetail.model");
const ImageModel = require("../models/image.model");
const ColorModel = require("../models/color.model");

class CartService {
  async addItemToCart(userId, productColor_id, quantity) {
    const cart = await CartModel.findOne({ where: { user_id: userId } });
    if (!cart) throw new Error("Không tìm thấy giỏ hàng của người dùng");

    const productColor = await ProductColorModel.findByPk(productColor_id);
    if (!productColor) throw new Error("Không tìm thấy sản phẩm");

    const existingItem = await CartItemModel.findOne({
      where: { cart_id: cart.cart_id, productColor_id },
      include: [{ model: ProductColorModel, as: "ProductColor" }],
    });

    const maxStock = productColor.stock_quantity;

    if (existingItem) {
      if (existingItem.quantity + quantity > maxStock) {
        throw new Error(`Số lượng tối đa có thể đặt là ${maxStock}`);
      }
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      if (quantity > maxStock) {
        throw new Error(`Số lượng tối đa có thể đặt là ${maxStock}`);
      }
      await CartItemModel.create({
        cart_id: cart.cart_id,
        productColor_id,
        quantity,
      });
    }

    return { message: "Thêm sản phẩm vào giỏ hàng thành công" };
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
                  model: ProductModel,
                  as: "Product",
                  attributes: ["product_id", "name", "price"],
                },
                { model: ColorModel, as: "Color" },
                { model: ImageModel, as: "ColorImages" },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      const newCart = await this.createCart(userId);
      return newCart;
    }
    return cart;
  }

  async deleteItemInCart(cartItem_id) {
    const cartItem = await CartItemModel.findByPk(cartItem_id);
    if (!cartItem) throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");

    await cartItem.destroy();
    return { message: "Đã xóa sản phẩm khỏi giỏ hàng" };
  }

  async updateItemQuantity(cartItem_id, quantity) {
    const cartItem = await CartItemModel.findByPk(cartItem_id, {
      include: [{ model: ProductColorModel, as: "ProductColor" }],
    });
    if (!cartItem) throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");

    const maxStock = cartItem.ProductColor.stock_quantity;
    if (quantity > maxStock) {
      throw new Error(`Số lượng tối đa có thể đặt là ${maxStock}`);
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    return { message: "Cập nhật số lượng thành công", data: cartItem };
  }

  async createCart(user_id) {
    const cart = await CartModel.create({ user_id });
    return cart;
  }
}

module.exports = new CartService();
