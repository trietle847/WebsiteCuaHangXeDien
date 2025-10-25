const OrderModel = require("../models/order.model");
const OrderDetail = require("../models/orderDetail.model");
const ProductModel = require("../models/product.model");
const PaymentModel = require("../models/payment.model");
const DeliveryModel = require("../models/delivery.model");

const { sequelize } = require("../utils/db");

class OrderService {
  // async createOrder(userId, products) {
  //   const transaction = await sequelize.transaction();

  //   try {
  //     // Lấy danh sách product_id
  //     const productIds = products.map((p) => p.product_id);

  //     // Lấy thông tin sản phẩm từ DB
  //     const dbProducts = await ProductModel.findAll({
  //       where: { product_id: productIds },
  //       transaction,
  //       lock: transaction.LOCK.UPDATE,
  //     });

  //     const productPriceMap = {};
  //     dbProducts.forEach((prod) => {
  //       productPriceMap[prod.product_id] = prod.price;
  //     });

  //     const totalAmount = products.reduce((sum, product) => {
  //       const price = productPriceMap[product.product_id];
  //       return sum + price * product.quantity;
  //     }, 0);

  //     // Tạo order
  //     const order = await OrderModel.create(
  //       {
  //         user_id: userId,
  //         payment_status: false,
  //         delivery_status: false,
  //         totalAmount,
  //       },
  //       { transaction }
  //     );

  //     // tạo thành công giảm lại số lượng trong kho
  //     for (const product of products) {
  //       await ProductModel.update(
  //         {
  //           stock_quantity: sequelize.literal(
  //             `stock_quantity - ${product.quantity}`
  //           ),
  //         },
  //         {
  //           where: { product_id: product.product_id },
  //           transaction,
  //         }
  //       );
  //     }

  //     const orderDetails = products.map((prod) => ({
  //       order_id: order.order_id,
  //       product_id: prod.product_id,
  //       quantity: prod.quantity,
  //       // price: productPriceMap[prod.product_id], // giá lúc đặt hàng
  //     }));

  //     await OrderDetail.bulkCreate(orderDetails, { transaction });

  //     await transaction.commit();

  //     return { order, orderDetails };
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw new Error("Lỗi khi tạo đơn hàng: " + error.message);
  //   }
  // }

  async createOrder(data, userId) {
    const { payment_id, delivery_id, items } = data;
    
    const payment = await PaymentModel.findByPk(payment_id);
    const delivery = await DeliveryModel.findByPk(delivery_id);

    const totalProduct = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const totalAmount = totalProduct + payment.price_payment + delivery.price_delivery

    const delivery_status = delivery.name === "Giao hàng tận nhà" ? "confirmed" : null

    const order = await OrderModel.create({
      user_id: userId,
      delivery_status,
      delivery_id,
      payment_id,
      totalAmount
    })
    
    for (const item of items) {
      await OrderDetail.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      })
    }

    return order
  }

  async getOrderByAdmin() {
    const orders = await OrderModel.findAll();

    return orders;
  }

  async getOrderByUser(userId) {
    const orders = await OrderModel.findAll({
      where: { user_id: userId },
    });

    return orders;
  }
}

module.exports = new OrderService();
