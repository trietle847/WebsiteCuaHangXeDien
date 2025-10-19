const productService = require("../services/product.service");
const ApiError = require("../middlewares/error.middleware");

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const files = req.files;
    const response = await productService.createProduct(data, files);
    res.send({
      message: "Tạo sản phẩm thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi thêm sản phẩm ${error}`));
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const response = await productService.getAllProduct();
    res.send({
      message: "Danh sách các sản phẩm",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy sản phẩm ${error}`));
  }
};

exports.findProductsByName = async (req, res, next) => {
  try {
    const { name } = req.body;
    const response = await productService.findProductByName(name);
    res.send({
      message: "Kết quả tìm kiếm",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi tìm sản phẩm ${error}`));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const response = await productService.deleteProduct(productId);
    res.send({
      message:response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi xóa sản phẩm ${error}`));
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const response = await productService.getProductById(productId);

    res.send({
      message: "Thông tin sản phẩm",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy sản phẩm ${error}`));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id
    const data = req.body
    const files = req.files
    
    const response = await productService.updateProduct(productId,data,files)
    
    res.send({
      message: "Cập nhật thông tin sản phẩm thành công",
      data: response
    })
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi cập nhật sản phẩm ${error}`));
  }
}