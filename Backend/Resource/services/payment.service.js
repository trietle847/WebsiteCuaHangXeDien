// src/services/payment.service.js
const PaymentModel = require("../models/payment.model");
const { createMomoPayment, verifyPaymentSignature } = require("../utils/momo");
const OrderModel = require("../models/order.model");
const orderService = require("./order.service");
const { parse } = require("path");

class PaymentService {
  async createMomoPayment(orderId) {
    const order = await OrderModel.findByPk(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    const orderInfo = `Thanh toán đơn hàng #${orderId}`;
    const momoRes = await createMomoPayment(
      orderId,
      10000,
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
    const resultCode = parseInt(data.resultCode, 10);

    const isValidSignature = verifyPaymentSignature(data);
    if (!isValidSignature) {
      throw new Error("Chữ ký không hợp lệ");
    }

    console.log("✅ Chữ ký hợp lệ từ MoMo");

    const orderId = data.orderId;
    console.log(data);
    if (resultCode === 0) {
      await orderService.updateOrder(orderId,{
        payment_status: "completed",
      })
      return { message: "Thanh toán thành công" };
    } else {
      await PaymentModel.update(
        { status: "failed" },
        { where: { order_id: orderId } }
      );
      throw new Error("Thanh toán thất bại");
    }
  }
}

module.exports = new PaymentService();
