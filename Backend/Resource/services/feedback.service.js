const FeedbackModel = require("../models/feedback.model");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");

class FeedbackService {
  async createComment(data) {
    const comment = await FeedbackModel.create(data);
    return comment;
  }

  async getAllComment(product_id, query = {}) {
    const { page, limit } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;
    const whereClause = {};
    if (product_id) {
      whereClause.product_id = product_id;
    }
    const { count, rows } = await FeedbackModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["user_id", "username", "first_name", "last_name"],
        },
        {
          model: ProductModel,
          as: "Product",
          attributes: ["product_id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit: validLimit,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
      currentPage: validPage,
    };
  }

  async getAllCommentByVisitors(product_id, query = {}) {
    const { page, limit } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;
    const whereClause = {};
    if (product_id) {
      whereClause.product_id = product_id;
      whereClause.status = true;
    }
    const { count, rows } = await FeedbackModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["user_id", "username", "first_name", "last_name"],
        },
        {
          model: ProductModel,
          as: "Product",
          attributes: ["product_id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit: validLimit,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
      currentPage: validPage,
    };
  }

  async activateComment(feedBack_id) {
    const comment = await FeedbackModel.findByPk(feedBack_id);
    if (!comment) {
      throw new Error("Bình luận không tồn tại");
    }
    comment.status = true;
    await comment.save();
    return {
      message: "Hiện bình luận thành công",
      comment,
    };
  }

  async deactivateComment(feedBack_id) {
    const comment = await FeedbackModel.findByPk(feedBack_id);
    if (!comment) {
      throw new Error("Bình luận không tồn tại");
    }
    comment.status = false;
    await comment.save();
    return {
      message: "Ẩn bình luận thành công",
      comment,
    };
  }
}

module.exports = new FeedbackService();
