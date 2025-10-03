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
    const { productId } = req.body;
    const response = await productService.deleteProduct(productId);
    res.send({
      response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi xóa sản phẩm ${error}`));
  }
};


exports.findProductsById = async (req, res, next) => {
  try {
    const { id } = req.params; // /product/:id
    if (!id) {
      return res.status(400).send({ message: "Thiếu id sản phẩm" });
    }

    const product = await productService.findProductsById(id);

    if (!product) {
      return res.status(404).send({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).send({
      message: "Tìm sản phẩm thành công",
      product,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi tìm sản phẩm: ${error.message}`));
  }
};
