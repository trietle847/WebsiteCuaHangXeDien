const RatingModel = require("../models/rating.model");
const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");
const {
  Delivery,
  Order,
  ProductColor,
  OrderDetail,
} = require("../models/associations");
const PaymentModel = require("../models/payment.model");

const ratingService = {
  async getPurchasedOrderItem(user_id, product_id) {
    return await OrderDetail.findOne({
      include: [
        {
          model: Order,
          as: "Order",
          where: { user_id },
          include: [
            { model: Delivery, as: "Delivery", where: { status: "delivered" } },
            {
              model: PaymentModel,
              as: "Payment",
              where: { status: "completed" },
            },
          ],
        },
        {
          model: ProductColor,
          as: "ProductColor",
          where: { product_id },
        },
      ],
    });
  },

  async create(data) {
    const orderItem = await this.getPurchasedOrderItem(
      data.user_id,
      data.product_id
    );

    if (!orderItem) {
      throw new Error(
        "Người dùng chưa mua sản phẩm này hoặc đơn hàng chưa hoàn tất"
      );
    }

    const existingRating = await RatingModel.findOne({
      where: { user_id: data.user_id, product_id: data.product_id },
    });

    if (existingRating) {
      throw new Error("Bạn đã đánh giá sản phẩm này rồi!");
    }

    const dataNew = {
      ...data,
      orderDetail_id: orderItem.orderDetail_id,
    };

    console.log("Found order item:", dataNew);
    return await RatingModel.create(dataNew);
  },

  async getAll(query = {}) {
    const where = {};
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;
    const offset = (page - 1) * limit;

    if (query.product_id) where.product_id = query.product_id;
    if (query.user_id) where.user_id = query.user_id;

    const { count, rows } = await RatingModel.findAndCountAll({
      where,
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
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  },

  async update(rating_id, data) {
    const rating = await RatingModel.findByPk(rating_id);

    if (!rating) {
      throw new Error("Đánh giá không tồn tại");
    }

    await rating.update({
      stars: data.stars,
      content: data.content,
    });

    return rating;
  },
  async getMyRating(user_id, product_id) {
    const rating = await RatingModel.findOne({
      where: {
        user_id,
        product_id,
      },
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
    });

    if (!rating) {
      throw new Error("Đánh giá không tồn tại");
    }
    return rating;
  },
};

module.exports = ratingService;
