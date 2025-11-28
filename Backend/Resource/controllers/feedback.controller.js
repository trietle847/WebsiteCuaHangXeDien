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
    const comments = await FeedbackService.getAllComment(product_id, req.query);

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

exports.getAllCommentByVisitors = async (req, res, next) => {
  try {
    const product_id = req.params.id;
    const { page, limit } = req.query;
    const comments = await FeedbackService.getAllCommentByVisitors(product_id, {
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

exports.activateComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await FeedbackService.activateComment(id);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi hiên bình luận ${error.message}`));
  }
};

exports.deactivateComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await FeedbackService.deactivateComment(id);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi ẩn bình luận ${error.message}`));
  }
};
