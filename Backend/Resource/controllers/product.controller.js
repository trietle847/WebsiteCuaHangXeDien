const BaseController = require("./baseController");
const productService = require("../services/product.service");
const ApiError = require("../middlewares/error.middleware");

class ProductController extends BaseController {
  constructor() {
    super(productService, "sản phẩm");
  }

  // Override create để xử lý uploadedImages
  create = async (req, res, next) => {
    try {
      const { uploadedImages, ...productData } = req.body;

      // Tạo product trước
      const newProduct = await productService.create(productData);

      // Nếu có images, tạo records trong bảng images
      if (uploadedImages && uploadedImages.length > 0) {
        await productService.addImages(newProduct.product_id, uploadedImages);
      }

      res.status(201).json({
        message: `Thêm mới ${this.name} thành công`,
        data: newProduct,
      });
    } catch (error) {
      return next(
        new ApiError(500, `Lỗi khi tạo ${this.name}: ${error.message}`)
      );
    }
  };

  // Override update để xử lý uploadedImages
  update = async (req, res, next) => {
    try {
      const { uploadedImages, ...productData } = req.body;

      // Cập nhật product
      const updatedProduct = await productService.update(
        req.params.id,
        productData
      );

      // Nếu có images mới, thêm vào
      if (uploadedImages && uploadedImages.length > 0) {
        await productService.addImages(req.params.id, uploadedImages);
      }

      res.status(200).json({
        message: `Cập nhật ${this.name} thành công`,
        data: updatedProduct,
      });
    } catch (error) {
      const statusCode = error.message.includes("không tìm thấy") ? 404 : 500;
      return next(
        new ApiError(
          statusCode,
          `Lỗi khi cập nhật ${this.name}: ${error.message}`
        )
      );
    }
  };

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
