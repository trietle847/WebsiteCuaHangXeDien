const PromotionService = require("../services/promotion.service");
const ApiError = require("../middlewares/error.middleware");

exports.createPromotion = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await PromotionService.createPromotion(data);
    res.send({
      message: "Tạo khuyến mãi thành công",
      promotions: response,
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
      message: "cập nhật thành công",
      response
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
      message: "Tìm kiếm thành công",
      promotion: response
    })
  } catch (error) {
        return next(new ApiError(500, `Lỗi khi tìm kiếm ${error}`));
  }
}
