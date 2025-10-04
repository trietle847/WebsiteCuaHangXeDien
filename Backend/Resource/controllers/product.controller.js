const BaseController = require("./baseController");
const productService = require("../services/product.service");
const ApiError = require("../middlewares/error.middleware");

class ProductController extends BaseController {
  constructor() {
    super(productService, "sản phẩm");
  }

  // Thêm method tìm kiếm riêng
  findByName = async (req, res, next) => {
    try {
      const { name } = req.body;
      const products = await productService.findByName(name);
      res.status(200).json({
        message: "Kết quả tìm kiếm",
        data: products,
      });
    } catch (error) {
      return next(new ApiError(500, `Lỗi tìm sản phẩm: ${error.message}`));
    }
  };
}

module.exports = new ProductController();
