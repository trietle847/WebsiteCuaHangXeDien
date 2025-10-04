const ApiError = require("../middlewares/error.middleware");

class BaseController {
  constructor(service, name) {
    this.service = service;
    this.name = name;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.service.getAll(req.query);
      res.status(200).json({
        message: `Lấy danh sách ${this.name} thành công`,
        ...result,
      });
    } catch (error) {
      return next(
        new ApiError(
          500,
          `Lỗi khi lấy danh sách ${this.name}: ${error.message}`
        )
      );
    }
  };

  getById = async (req, res, next) => {
    try {
      const item = await this.service.getById(req.params.id);
      res.status(200).json({
        message: `Lấy ${this.name} thành công`,
        data: item,
      });
    } catch (error) {
      const statusCode = error.message.includes("không tìm thấy") ? 404 : 500;
      return next(
        new ApiError(statusCode, `Lỗi khi lấy ${this.name}: ${error.message}`)
      );
    }
  };

  create = async (req, res, next) => {
    try {
      const newItem = await this.service.create(req.body);
      res.status(201).json({
        message: `Thêm mới ${this.name} thành công`,
        data: newItem,
      });
    } catch (error) {
      return next(
        new ApiError(500, `Lỗi khi tạo ${this.name}: ${error.message}`)
      );
    }
  };

  update = async (req, res, next) => {
    try {
      const updatedItem = await this.service.update(req.params.id, req.body);
      res.status(200).json({
        message: `Cập nhật ${this.name} thành công`,
        data: updatedItem,
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

  delete = async (req, res, next) => {
    try {
      const result = await this.service.delete(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message.includes("không tìm thấy") ? 404 : 500;
      return next(
        new ApiError(statusCode, `Lỗi khi xóa ${this.name}: ${error.message}`)
      );
    }
  };
}

module.exports = BaseController;
