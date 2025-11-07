const FeedbackService = require("../services/feedback.service");
const ApiError = require("../middlewares/error.middleware");

exports.createComment = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const product_id = req.params.id;
    console.log("product_id", product_id);
    const data = req.body;

    const response = await FeedbackService.createComment({
      ...data,
      user_id: userId,
      product_id: product_id,
    });
    res.send({
      message: "Tạo comment thành công",
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi tạo comment ${error}`);
  }
};

exports.getAllComment = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    const { page = 1, limit = 5 } = req.query;

    const comments = await FeedbackService.getAllComment(product_id, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      message: "Lấy tất cả comment thành công",
      data: comments.data,
      total: comments.total,
      totalPages: comments.totalPages,
      currentPage: comments.currentPage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Lỗi khi lấy tất cả comment: ${error.message || error}`,
    });
  }
};
