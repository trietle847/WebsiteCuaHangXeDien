const PromotionService = require("../services/promotion.service");
const ApiError = require("../middlewares/error.middleware");
const promotionService = require("../services/promotion.service");

exports.createPromotion = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await PromotionService.createPromotion(data);
    res.send({
      message: "Tạo khuyến mãi thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi tạo khuyến mãi ${error}`));
  }
};

exports.deletePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.id;
    const response = await PromotionService.deletePromotion(promotionId);
    res.send({
      message: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa khuyến mãi ${error}`));
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const promotionId = req.params.id;
    const data = req.body
    const response = await PromotionService.updatePromotion(promotionId, data);
    res.send({
      message: "Cập nhật thành công",
      data:response
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa khuyến mãi ${error}`));
  }
};

exports.findPromotion = async (req, res, next) => {
  try {
    const {query} = req.query
    const response = await PromotionService.findPromotion(query)
    
    res.send({
      message: "Kết quả tìm kiếm",
      data: response
    })
  } catch (error) {
        return next(new ApiError(500, `Lỗi khi tìm kiếm ${error}`));
  }
}

exports.search = async (req, res, next) => {
  const { entity } = req.params;
  const { keyword = "", page = 1, limit = 10 } = req.query;

  const validPage = Math.max(parseInt(page) || 1, 1);
  const validLimit = Math.max(Math.max(parseInt(limit) || 10, 1), 100);

  try {
    const response = await promotionService.search(keyword, validPage, validLimit);

    res.send({
      message: "Kết quả tìm kiếm",
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi đăng ký sửa xe ${error}`);
  }
};
