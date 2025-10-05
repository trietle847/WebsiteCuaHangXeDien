const ApiError = require("../middlewares/error.middleware");
const ImageService = require("../services/image.service");

exports.createImage = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Chưa chọn file" });

    const response = await ImageService.createImage(data, file);
    res.send({
      message: "Thêm ảnh thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi thêm ảnh ${error}`));
  }
};

exports.updateImage = async (req, res, next) => {
  try {
    const data = req.body;
    const file = req.file;
    const id = req.params.id;
    console.log(file);

    const response = await ImageService.updateImage(id, data, file);
    res.send({
      message: "Cập nhật ảnh thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi cập nhật ảnh ${error}`));
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const imageId = req.params;
    const response = await ImageService.deleteImage(imageId);

    res.send({
      message: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa ảnh ${error}`));
  }
};

exports.getAllImage = async (req, res, next) => {
  try {
    const response = await ImageService.getAllImage();
    res.send({
      message: "Danh sách toàn bộ ảnh",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy toàn bộ ảnh ${error}`));
  }
};

exports.getImageById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const response = await ImageService.getImageById(productId);

    res.send({
      message: "Hình ảnh theo sản phẩm",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy ảnh ${error}`));
  }
};
