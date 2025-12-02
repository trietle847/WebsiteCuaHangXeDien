const PromotionModel = require("../models/promotion.model");
const { Op } = require("sequelize");

class PromotionService {
  async createPromotion(data) {
    if(data.max_discount_amount === 0 || data.max_discount_amount === "") {
      delete data.max_discount_amount;
    }
    const promotion = await PromotionModel.create(data);
    return promotion;
  }

  async deletePromotion(promotionId) {
    const promotion = await PromotionModel.findByPk(promotionId);

    if (!promotion) {
      throw new Error("Không có khuyến mãi đó");
    }

    promotion.destroy();
  }

  async updatePromotion(promotionId, data) {
    const promotion = await PromotionModel.findByPk(promotionId);

    if (!promotion) {
      throw new Error("Không có khuyến mãi đó");
    }

    promotion.update(data);
    return promotion;
  }

  async getAllPromotion(query) {
        if(!query || Object.keys(query).length === 0) {
      const promotions = await PromotionModel.findAll({
        where: {
          start_date: { [Op.lte]: new Date() },
          end_date: { [Op.gte]: new Date() },
        }
      });
      return {
        data: promotions,
      };
    }

    const { keyword = "", page = 1, limit = 10 } = query;

    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(Math.max(parseInt(limit) || 10, 1), 10);

    const offset = (validPage - 1) * validLimit;

    const { count, rows } = await PromotionModel.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { code: { [Op.like]: `%${keyword}%` } },
        ],
      },
      distinct: true,
      offset,
      limit: validLimit,
    });
    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
    };
  }

  async getPromotionById(promotionId) {
    const promotion = await PromotionModel.findByPk(promotionId);
    if (!promotion) {
      throw new Error("Không tìm thấy khuyến mãi");
    }
    return promotion;
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

module.exports = new PromotionService();
