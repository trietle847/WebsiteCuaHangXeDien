const OrderModel = require("../models/order.model");
const OrderDetailModel = require("../models/orderDetail.model");
const ProductModel = require("../models/product.model");
const PaymentModel = require("../models/payment.model");
const DeliveryModel = require("../models/delivery.model");
const ProductColorModel = require("../models/productColor.model");
const PromotionModel = require("../models/promotion.model");
const UserModel = require("../models/user.model");
const ImageModel = require("../models/image.model");
const { sequelize } = require("../utils/db");
const { Op } = require("sequelize");
const ColorModel = require("../models/color.model");
const vehicleService = require("./vehicle.service");

class OrderService {
  async getAllOrder(query) {
    const { keyword = "", page = 1, limit = 10 } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 10, 1);
    const offset = (validPage - 1) * validLimit;

    const options = {
      offset,
      limit: validLimit,
      subQuery: false,
      include: [
        {
          model: DeliveryModel,
          as: "Delivery",
          required: false,
        },
        {
          model: PaymentModel,
          as: "Payment",
          required: false,
        },
        {
          model: UserModel,
          as: "User",
          attributes: [
            "user_id",
            [
              sequelize.literal("CONCAT(last_name, ' ', first_name)"),
              "fullname",
            ],
            "email",
            "phone",
          ],
          required: false,
        },
        {
          model: OrderDetailModel,
          as: "OrderDetails",
          required: false,
          include: [
            {
              model: ProductColorModel,
              as: "ProductColor",
              required: false,
              paranoid: false, // Cho phép xem cả màu đã xóa
              attributes: ["productColor_id", "product_id", "color_id"], // Chỉ lấy ID
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
    };

    // Thêm where condition nếu có keyword
    if (keyword) {
      options.where = {
        [Op.or]: [
          { order_id: { [Op.like]: `%${keyword}%` } },
          { "$User.first_name$": { [Op.like]: `%${keyword}%` } },
          { "$User.last_name$": { [Op.like]: `%${keyword}%` } },
          { "$User.email$": { [Op.like]: `%${keyword}%` } },
          { "$User.phone$": { [Op.like]: `%${keyword}%` } },
          sequelize.where(
            sequelize.fn(
              "CONCAT",
              sequelize.col("User.last_name"),
              " ",
              sequelize.col("User.first_name")
            ),
            {
              [Op.like]: `%${keyword}%`,
            }
          ),
        ],
      };
    }

    const { count, rows } = await OrderModel.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
    };
  }

  async getOrderByUser(userId, query = {}) {
    const { status, page = 1, limit = 10 } = query;

    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;

    const { count, rows } = await OrderModel.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: DeliveryModel,
          as: "Delivery",
          where: status ? { status: status.trim() } : undefined,
          required: Boolean(status),
        },
        {
          model: PaymentModel,
          as: "Payment",
          required: false,
        },
        {
          model: OrderDetailModel,
          as: "OrderDetails",
          required: false,
          include: [
            {
              model: ProductColorModel,
              as: "ProductColor",
              required: false,
              paranoid: false,
              include: [
                {
                  model: ColorModel,
                  as: "Color",
                },
                {
                  model: ImageModel,
                  as: "ColorImages",
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      distinct: true,
      offset,
      limit: validLimit,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
      currentPage: validPage,
    };
  }

  async getOrderById(orderId) {
    const order = await OrderModel.findByPk(orderId, {
      include: [
        {
          model: DeliveryModel,
          as: "Delivery",
          required: false,
        },
        {
          model: PaymentModel,
          as: "Payment",
          required: false,
        },
        {
          model: UserModel,
          as: "User",
          attributes: [
            "user_id",
            [
              sequelize.literal("CONCAT(last_name, ' ', first_name)"),
              "fullname",
            ],
            "email",
            "phone",
          ],
          required: false, // Dùng LEFT JOIN
        },
        {
          model: OrderDetailModel,
          as: "OrderDetails",
          required: false,
          include: [
            {
              model: ProductColorModel,
              as: "ProductColor",
              required: false,
              paranoid: false, // Cho phép xem cả màu đã xóa
              attributes: ["productColor_id", "product_id", "color_id"],
              // Nếu cần ảnh, có thể thêm:
              // include: [{ model: ImageModel, as: "ColorImages" }]
              include: [
                {
                  model: ColorModel,
                  as: "Color",
                },
                {
                  model: ImageModel,
                  as: "ColorImages",
                },
                {
                  model: ProductModel,
                  as: "Product",
                }
              ],

            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    return order;
  }

  // Hàm này có chức năng cho phép nhân viên bán hàng tạo đơn hàng cho khách hàng mua trực tiếp
  async createOrderByStaff(data, customerId) {
    const transaction = await sequelize.transaction();

    try {
      const { items, note, delivery, payment } = data;
      // Xác thực các thông tin cơ bản
      await this.validateOrderInput(data);

      // Xác thực và khóa tồn kho
      const validatedItems = await this.validateAndLockStock(
        items,
        transaction
      );

      let promo = null;
      if (data.voucher) {
        const result = await PromotionModel.findByPk(data.voucher.promotion_id);
        if (!result) {
          throw new Error("Mã khuyến mãi không hợp lệ.");
        }
        promo = result;
      }

      // Tính tổng tiền
      const totalAmount = await this.calculateTotalAmount(
        validatedItems,
        promo
      );

      // Tạo đơn hàng
      const order = await OrderModel.create(
        {
          user_id: customerId,
          note: note || null,
          totalAmount: totalAmount + (delivery.cost || 0),
          promotion_code: promo ? promo.code : null,
          discount_value: promo ? promo.discount_value : null,
        },
        { transaction }
      );

      // Tạo order details
      await this.createOrderDetails(
        order.order_id,
        validatedItems,
        transaction
      );

      // Tạo delivery
      await this.createDelivery(order.order_id, delivery, transaction);

      // Tạo payment
      await this.createPayment(order.order_id, payment, transaction);

      // Tạo liên kết đơn hàng - khuyến mãi nếu có
      if (promo) {
        await this.createPromotionOrderLink(
          promo.promotion_id,
          order.order_id,
          transaction
        );
      }

      // Cập nhật tồn kho
      await this.decreaseStock(validatedItems, transaction);

      await transaction.commit();

      // Tạo vehicle SAU KHI commit thành công để tránh conflict với transaction
      if (delivery.status === "delivered" && payment.status === "completed") {
        const finalOrder = await this.getOrderById(order.order_id);
        // Chạy background task không chặn response
        setImmediate(() => {
          vehicleService
            .createVehicles(finalOrder, customerId)
            .catch((error) => {
              console.error(
                `Failed to create vehicles for order ${order.order_id}:`,
                error
              );
            });
        });
        return finalOrder;
      }

      const finalOrder = await this.getOrderById(order.order_id);
      return finalOrder;
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }

  async updateOrder(orderId, data) {
    const transaction = await sequelize.transaction();
    try {
      const order = await OrderModel.findByPk(orderId, {
        include: [
          {
            model: OrderDetailModel,
            as: "OrderDetails",
            include: [{ model: ProductColorModel, as: "ProductColor" }],
          },
          {
            model: UserModel,
            as: "User",
          },
        ],
      });
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Xác thực dữ liệu đầu vào
      const { delivery_status, payment_status } = data;

      if (!delivery_status && !payment_status) {
        throw new Error("Không tìm thấy dữ liệu để cập nhật");
      }

      const delivery = await DeliveryModel.findOne({
        where: { order_id: orderId },
        transaction,
      });
      const payment = await PaymentModel.findOne({
        where: { order_id: orderId },
        transaction,
      });

      if (delivery_status === "failed" || payment_status === "failed") {
        // Đơn hàng thất bại => hoàn trả tồn kho
        for (const item of order.OrderDetails) {
          await ProductColorModel.update(
            {
              stock_quantity: sequelize.literal(
                `stock_quantity + ${item.quantity}`
              ),
            },
            {
              where: { productColor_id: item.ProductColor.productColor_id },
              transaction,
            }
          );
        }
      }

      if (delivery) {
        await delivery.update({ status: delivery_status }, { transaction });
        await delivery.reload();
      }
      if (payment) {
        await payment.update({ status: payment_status }, { transaction });
        await payment.reload();
      }

      await transaction.commit();

      console.log("Status received: ", delivery_status, payment_status);

      // Tạo vehicle SAU KHI commit thành công để tránh conflict với transaction
      if (delivery_status === "delivered" && payment_status === "completed") {
        const updatedOrder = await this.getOrderById(orderId);
        // Chạy background task không chặn response
        setImmediate(() => {
          vehicleService
            .createVehicles(updatedOrder, order.User.user_id)
            .catch((error) => {
              console.error(
                `Failed to create vehicles for order ${orderId}:`,
                error
              );
            });
        });
        return updatedOrder;
      }

      return await this.getOrderById(orderId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  async createOrderByUser(data, userId) {
    const transaction = await sequelize.transaction();
    try {
      const { items, note, delivery, payment, promotion_id, promotion_code } =
        data;
      console.log(data);

      // 1️⃣ Validate cơ bản
      await this.validateOrderInput(data);

      // 2️⃣ Validate & lock stock
      const validatedItems = await this.validateAndLockStock(
        items,
        transaction
      );

      // 3️⃣ Xử lý voucher nếu có
      // let promo = null;
      // if (voucher && voucher.promotion_id) {
      //   const result = await PromotionModel.findByPk(voucher.promotion_id);
      //   if (!result) throw new Error("Mã khuyến mãi không hợp lệ.");
      //   promo = result;
      // }

      // 4️⃣ Tính tổng tiền
      const totalAmount = await this.calculateTotalAmount(
        validatedItems,
        promotion_id
      );

      // 5️⃣ Tạo order
      const order = await OrderModel.create(
        {
          user_id: userId,
          note: note || null,
          totalAmount: totalAmount.totalAmount + (delivery?.cost || 0),
          promotion_code: promotion_code,
          promotion_id: promotion_id,
          discount_value: totalAmount.discount_value,
        },
        { transaction }
      );

      // 6️⃣ Tạo order details
      await this.createOrderDetails(
        order.order_id,
        validatedItems,
        transaction
      );

      // 7️⃣ Tạo delivery
      await this.createDelivery(order.order_id, delivery, transaction);

      // 8️⃣ Tạo payment
      await this.createPayment(order.order_id, payment, transaction);

      // 9️⃣ Liên kết khuyến mãi nếu có
      if (promotion_id) {
        await this.createPromotionOrderLink(
          promotion_id,
          order.order_id,
          transaction
        );
      }

      // 🔟 Cập nhật tồn kho
      await this.decreaseStock(validatedItems, transaction);

      await transaction.commit();

      // ✅ Trả về đơn hàng chi tiết
      return await this.getOrderById(order.order_id);
    } catch (error) {
      await transaction.rollback();
      throw new Error(error.message);
    }
  }

  // ==================== Xác thực ====================

  async validateOrderInput(data) {
    const { items, delivery, payment, voucher } = data;

    // Kiểm tra items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Đơn hàng phải có ít nhất một sản phẩm.");
    }

    // Kiểm tra từng item
    items.forEach((item, index) => {
      if (!item.productColor_id || !item.quantity || item.quantity <= 0) {
        throw new Error(`Sản phẩm thứ ${index + 1} không hợp lệ`);
      }
    });

    // Kiểm tra delivery
    if (!delivery || !delivery.method) {
      throw new Error("Phương thức giao hàng không hợp lệ.");
    }

    if (delivery.method === "home_delivery" && !delivery.address) {
      throw new Error(
        "Địa chỉ giao hàng là bắt buộc khi chọn giao hàng tận nơi."
      );
    }

    // Kiểm tra thông tin người nhận
    if (delivery.recipient_name && !delivery.recipient_phone) {
      throw new Error("Thông tin người nhận không hợp lệ.");
    }

    // Kiểm tra payment
    if (!payment || !payment.method) {
      throw new Error("Phương thức thanh toán không hợp lệ.");
    }
  }

  async validateAndLockStock(items, transaction) {
    const productColorIds = items.map((item) => item.productColor_id);

    // Lấy thông tin tồn kho và khóa bản ghi
    const productColors = await ProductColorModel.findAll({
      where: { productColor_id: { [Op.in]: productColorIds } },
      include: [
        { model: ProductModel, as: "Product" },
        { model: ColorModel, as: "Color" },
      ],
      transaction,
      // Khóa bản ghi để tránh tranh chấp khi cập nhật tồn kho
      lock: transaction.LOCK.UPDATE,
    });

    // Kiểm tra tất cả sản phẩm
    if (productColors.length !== items.length) {
      throw new Error("Một số sản phẩm không tồn tại trong kho.");
    }

    // Kiểm tra tồn kho và tạo validateItems (các sản phẩm đã được xác thực)
    const validateItems = items.map((item) => {
      const productColor = productColors.find(
        (pc) => pc.productColor_id === item.productColor_id
      );
      if (!productColor || productColor.stock_quantity < item.quantity) {
        throw new Error(
          `Sản phẩm ${item.productColor_id} không đủ số lượng trong kho`
        );
      }
      return {
        productColor_id: productColor.productColor_id,
        quantity: item.quantity,
        current_stock: productColor.stock_quantity,
        price: productColor.Product.price,
        product_name: productColor.Product.name,
        color_name: productColor.Color.name,
        total_price: productColor.Product.price * item.quantity,
        productColorInstance: productColor, // giữ lại instance để cập nhật tồn kho sau này
      };
    });

    return validateItems;
  }

  // ==================== Tính toán ====================

  async calculateTotalAmount(validatedItems, promotionId) {
    const promotion = await PromotionModel.findByPk(promotionId);
    console.log(promotion);
    const total = validatedItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    let discount_value = 0;

    if (!promotion) {
      return total;
    }

    if (promotion) {
      // Áp dụng khuyến mãi nếu có
      if (promotion.discount_type === "fixed_amount") {
        discount_value = promotion.discount_value;
      } else if (promotion.discount_type === "percentage") {
        if (promotion.max_discount_amount) {
          discount_value = Math.min(
            total * (promotion.discount_value / 100),
            promotion.max_discount_amount
          );
        } else {
          discount_value = total * (promotion.discount_value / 100);
        }
      }
      promotion.discount_value = discount_value;
    }

    // return total - discount_value;
    return {
      totalAmount: total - discount_value,
      discount_value: discount_value,
    };
  }

  // ==================== Các bảng ghi liên quan ====================
  async createOrderDetails(orderId, validatedItems, transaction) {
    const orderDetailsData = validatedItems.map((item) => ({
      order_id: orderId,
      productColor_id: item.productColor_id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.total_price,
      product_name: item.product_name,
      color_name: item.color_name,
    }));

    return await OrderDetailModel.bulkCreate(orderDetailsData, { transaction });
  }

  async createDelivery(orderId, deliveryData, transaction) {
    const delivered_at =
      deliveryData.status === "delivered" ? new Date() : null;
    const delivery = await DeliveryModel.create(
      {
        order_id: orderId,
        method: deliveryData.method,
        address: deliveryData.address || null,
        cost: deliveryData.cost || 0,
        recipient_name: deliveryData.recipient_name,
        recipient_phone: deliveryData.recipient_phone,
        note: deliveryData.note || null,
        status: deliveryData.status || "processing",
        delivered_at,
      },
      { transaction }
    );
    return delivery;
  }

  async createPayment(orderId, paymentData, transaction) {
    const payment = await PaymentModel.create(
      {
        order_id: orderId,
        method: paymentData.method,
        status: paymentData.status || "pending",
      },
      { transaction }
    );
    return payment;
  }

  async createPromotionOrderLink(promotionId, orderId, transaction) {
    const promotion = await PromotionModel.findByPk(promotionId, {
      transaction,
    });
    const order = await OrderModel.findByPk(orderId, { transaction });

    if (!promotion || !order) {
      throw new Error("Khuyến mãi hoặc đơn hàng không tồn tại.");
    }

    await order.setPromotion(promotion, { transaction });
  }

  // ==================== Cập nhật tồn kho ====================
  async decreaseStock(validatedItems, transaction) {
    const updatePromises = validatedItems.map((item) => {
      return item.productColorInstance.decrement("stock_quantity", {
        by: item.quantity,
        transaction,
      });
    });

    await Promise.all(updatePromises);
  }
}

module.exports = new OrderService();
