const ProductModel = require("../models/product.model");
const productService = require("../services/product.service");
const ProductService = require("../services/product.service");
const ApiError = require("../middlewares/error.middleware");

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await productService.createProduct(data);
    res.send({
      message: "Tạo sản phẩm thành công",
      product: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi thêm sản phẩm ${error}`));
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const response = await productService.getAllProduct();
    res.send({
      message: "lấy danh sách sản phẩm thành công",
      products: response,
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
      message: "kết quả tìm kiếm",
      products: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi tìm sản phẩm ${error}`));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params.id;
    const response = await productService.deleteProduct(productId);
    res.send({
      response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi xóa sản phẩm ${error}`));
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id
    console.log(productId);
    const response = await productService.getProductById(productId)

    res.send({
      product: response
    })
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy sản phẩm ${error}`));
  }
}
