const OrderService = require("../services/order.service");
const ApiError = require("../middlewares/error.middleware");

exports.getAllOrder = async (req, res, next) => {
  try {
    const response = await OrderService.getAllOrder(req.query);
    res.send({
      message: "Danh sách các đơn hàng",
      ...response,
    });
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Lỗi khi lấy các đơn hàng: ${error.message}`)
    );
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const response = await OrderService.getOrderById(orderId);
    res.send({
      message: "Lấy đơn hàng thành công",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy đơn hàng: ${error.message}`));
  }
};

exports.getOrderByIdUserId = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.user_id;


    const order = await OrderService.getOrderById(orderId);

    if (!order || order.user_id !== userId) {
      return res
        .status(403)
        .send({ message: "Bạn không có quyền xem đơn hàng này" });
    }

    res.send({
      message: "Lấy đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy đơn hàng: ${error.message}`));
  }
};

exports.getOrderByUserId = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { status, page, limit } = req.query; // đổi từ overallStatus → status

    const result = await OrderService.getOrderByUser(userId, {
      status, // truyền status vào
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "Lấy đơn hàng thành công",
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng",
      error: error.message,
    });
  }
};

exports.createOrderByStaff = async (req, res, next) => {
  try {
    const { userId, ...data } = req.body;
    const response = await OrderService.createOrderByStaff(data, userId);
    res.send({
      message: "Tạo đơn hàng thành công",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Lỗi khi tạo đơn hàng: ${error.message}`));
  }
};

exports.createOrderByUser = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const data = req.body;
    const response = await OrderService.createOrderByUser(data, userId);
    res.send({
      message: "Tạo đơn hàng thành công",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Lỗi khi tạo đơn hàng: ${error.message}`));
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    const response = await OrderService.updateOrder(orderId, data);
    res.send({
      message: "Cập nhật đơn hàng thành công",
      data: response,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật đơn hàng: ${error.message}`)
    );
  }
};
