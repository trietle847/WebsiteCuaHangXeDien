const FeedbackService = require("../services/feedback.service");
const ApiError = require("../middlewares/error.middleware");

exports.createComment = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const data = req.body;

    const response = await FeedbackService.createComment({
      ...data,
      user_id: userId,
    });
    res.send({
      message: "Tạo comment thành công",
      comment: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi tạo comment ${error}`);
  }
};

exports.getAllComment = async (req, res, next) => {
  try {
    const response = await FeedbackService.getAllComment();

    res.send({
      message: "lấy tất cả comment thành công",
      comments: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi lấy tất cả comment ${error}`);
  }
};
