const PromotionModel = require("../models/promotion.model")
const { Op } = require("sequelize");

class PromotionService {
  async createPromotion(data) {
    const promotion = await PromotionModel.create(data);
    return promotion;
  }

  async deletePromotion(promotionId) {
    const promotion = await PromotionModel.findByPk(promotionId);

    if (!promotion) {
      throw new Error("Không có khuyến mãi đó");
    }

    promotion.destroy();
    return {
      message: "Xóa thành công",
    };
  }

  async updatePromotion(promotionId, data) {
    const promotion = await PromotionModel.findByPk(promotionId);

    if (!promotion) {
      throw new Error("Không có khuyến mãi đó");
    }

    promotion.update(data);
    return promotion;
  }

  async getAllPromotion() {
    const promotions = await PromotionModel.findAll();

    return promotions;
  }

  // async findPromotion(query) {
  //   const promotions = await PromotionModel.findAll({
  //     where: {
  //       [Op.or]: [
  //         { code: { [Op.like]: `%${query}%` } },
  //         { name: { [Op.like]: `%${query}%` } },
  //       ],
  //     },
  //   });

  //   return promotions;
  // }

  async search(keyword = "", page = 1, limit = 15) {
    const offset = (page - 1) * limit;

    const { count, rows } = await PromotionModel.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { code: { [Op.like]: `%${keyword}%` } },
        ],
      },
      offset,
      limit,
    });
    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }
}

module.exports = new PromotionService()