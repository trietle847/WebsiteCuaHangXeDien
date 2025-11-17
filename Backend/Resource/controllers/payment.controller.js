const PaymentService = require("../services/payment.service");
const ApiError = require("../middlewares/error.middleware");

class PaymentController {
  async createMomoPayment(req, res, next) {
    try {
      const order_id = req.params.order_id;

      const momoRes = await PaymentService.createMomoPayment(order_id);
      res.send({
        success: true,
        qrCodeUrl: momoRes.qrCodeUrl,
        payUrl: momoRes.payUrl,
      });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, `message ${error}`));
      // res.status(400).json({ success: false, message: err.message });
    }
  }

  async handleMomoIPN(req, res, next) {
    try {
      const result = await PaymentService.handleMomoIPN(req.body);
      res.send(result);
    } catch (error) {
      return next(new ApiError(500, `Lỗi khi thanh toán ${error}`));
    }
  }
}

module.exports = new PaymentController();
