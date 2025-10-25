const OrderService = require("../services/order.service");
const ApiError = require("../middlewares/error.middleware");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const data = req.body;
    console.log(data);

    const response = await OrderService.createOrder(data, userId);

    res.send({
      message: "Tạo đơn hàng thành công",
      data: response

    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tạo đơn hàng: ${error.message}`));
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    let response;
    const role = req.user.roles;
    if (role.includes("admin") || role.includes("staff")) {
      response = await OrderService.getOrderByAdmin();
    } else {
      response = await OrderService.getOrderByUser(req.user.user_id);
    }
    res.send({
      message: "Danh sách các đơn hàng",
      data: response,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy các đơn hàng: ${error.message}`)
    );
  }
};
