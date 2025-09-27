const ApiError = require("../middlewares/error.middleware");
const FavouriteService = require("../services/favourite.service");

exports.addProductToFavourite = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    console.log(userId);
    const { productId } = req.body;

    const response = await FavouriteService.addProductToFavourite(
      userId,
      productId
    );

    res.send({
      response,
    });
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi thêm sản phẩm vào danh sách yêu thích ${error}`
      )
    );
  }
};

exports.getFavouriteProduct = async (req, res, next) => {
  try {
    const user = req.user.user_id
    const response = await FavouriteService.getFavouriteProduct(user)

    res.send({
      message: "lấy các sản phẩm trong danh sách yêu thích thành công",
      products: response
    })
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy sản phẩm vào danh sách yêu thích ${error}`
      )
    );
  }
}

exports.deleteProductInFavourite = async (req, res, next) => {
  try {
    const userId = req.user.user_id
    const { productId } = req.body;

    const response = await FavouriteService.deleteProductInFavourite(userId, productId)

    res.send({
      response
    })
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa sản phẩm khỏi danh sách yêu thích ${error}`)
    );
  }
}