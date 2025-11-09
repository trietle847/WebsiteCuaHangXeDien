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

  /**
   * Tạo đánh giá (nếu người dùng đã mua sản phẩm)
   */
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

    const dataNew = {
      ...data,
      orderDetail_id: orderItem.orderDetail_id,
    };

    console.log("Found order item:", dataNew);
    return await RatingModel.create(dataNew);
  },

  /**
   * ✅ Lấy danh sách đánh giá
   */
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
};

module.exports = ratingService;
