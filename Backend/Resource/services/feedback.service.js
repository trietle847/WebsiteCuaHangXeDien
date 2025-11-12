const FeedbackModel = require("../models/feedback.model");
const UserModel = require("../models/user.model");

class FeedbackService {
  async createComment(data) {
    const comment = await FeedbackModel.create(data);
    return comment;
  }

  async getAllComment(product_id, query = {}) {
    const { page = 1, limit = 5 } = query;

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
          as: "User", // alias đúng
          attributes: ["user_id", "username", "first_name", "last_name"],
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
}

module.exports = new FeedbackService();
