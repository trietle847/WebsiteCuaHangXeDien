// src/services/payment.service.js
const PaymentModel = require("../models/payment.model");
const { createMomoPayment } = require("../utils/momo");
const OrderModel = require("../models/order.model");

class PaymentService {
  async createMomoPayment(orderId) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    const orderInfo = `Thanh toán đơn hàng #${orderId}`;
    const momoRes = await createMomoPayment(
      orderId,
      order.totalAmount,
      orderInfo
    );

    // Cập nhật trạng thái payment thành "processing"
    await PaymentModel.update(
      { status: "processing" },
      { where: { order_id: orderId } }
    );

    return momoRes;
  }

  async handleMomoIPN(data) {
    console.log("📩 IPN từ MoMo:", data);

    const orderId = data.orderId;
    if (data.resultCode === 0) {
      await PaymentModel.update(
        { status: "completed" },
        { where: { order_id: orderId } }
      );
      await OrderModel.update(
        { payment_status: "completed" },
        { where: { order_id: orderId } }
      );
      return { message: "Thanh toán thành công" };
    } else {
      await PaymentModel.update(
        { status: "failed" },
        { where: { order_id: orderId } }
      );
      return { message: "Thanh toán thất bại" };
    }
  }
}

module.exports = new PaymentService();
