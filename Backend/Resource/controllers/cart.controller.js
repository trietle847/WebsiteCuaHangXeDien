const ApiError = require("../middlewares/error.middleware");
const cartService = require("../services/cart.service");

exports.addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { productColorId, quantity } = req.body;

    const response = await cartService.addItemToCart(
      userId,
      productColorId,
      quantity
    );

    res.send({
      message:"Thêm sản phẩm vào giỏ hàng",
      data:response,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi thêm sản phẩm vào giỏ hàng ${error}`
      )
    );
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = req.user.user_id
    const response = await cartService.getCart(user)

    res.send({
      message: "Các sản phẩm trong giỏ hàng",
      data: response
    })
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy sản phẩm vào giỏ hàng ${error}`
      )
    );
  }
}

exports.deleteItemInCart= async (req, res, next) => {
  try {
    const cartItem = req.params.id

    const response = await cartService.deleteItemInCart(cartItem)

    res.send({
      message: response
    })
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa sản phẩm khỏi giỏ hàng ${error}`)
    );
  }
}