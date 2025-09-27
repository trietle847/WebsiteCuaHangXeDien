const ApiError = require("../middlewares/error.middleware");
const ImageService = require("../services/image.service");

exports.createImage = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await ImageService.createImage(data);
    res.send({
      message: "Thêm ảnh thành công",
      response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi thêm ảnh ${error}`));
  }
};

exports.updateImage = async (req, res, next) => {
  try {
    const data = req.body;
    const imageId = req.params.id;
    console.log(data);

    const response = await ImageService.updateImage(imageId, data);
    res.send({
      message: "cập nhật thành công",
      image: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi cập nhật ảnh ${error}`));
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.body;
    const response = await ImageService.deleteImage(imageId);

    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa ảnh ${error}`));
  }
};

exports.getAllImage = async (req, res, next) => {
  try {
    const response = await ImageService.getAllImage();
    res.send({
      message: "lấy danh sách ảnh",
      images: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy toàn bộ ảnh ${error}`));
  }
};

exports.getImageById = async (req, res, next) => {
  try {
    const { imageId } = req.body;
    const response = await ImageService.getImageById(imageId);

    res.send({
      message: "lấy hình ảnh thành công",
      image: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy ảnh ${error}`));
  }
};
