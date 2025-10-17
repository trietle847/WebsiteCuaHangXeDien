const ApiError = require("../middlewares/error.middleware");
const ColorService = require("../services/color.service");

exports.createColor = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await ColorService.createColor(data);

    res.send({
      message: "Thêm màu mới thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi thêm màu ${error}`));
  }
};

exports.deleteColor = async (req, res, next) => {
  try {
    const colorId = req.params;
    const response = await ColorService.deleteColor(colorId);

    res.send({
      message: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa màu ${error}`));
  }
};

exports.getAllColor = async (req, res, next) => {
  try {
    const response = await ColorService.getAllColor();

    res.send({
      message: "Danh sách các màu",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy tất cả màu ${error}`));
  }
};
