const vehicleService = require("../services/vehicle.service");
const ApiError = require("../middlewares/error.middleware");

exports.getVehicleByUser = async (req, res, next) => {
  try {
    const user = req.user;  
    const vehicles = await vehicleService.getVehicleByUserId(user.user_id);
    res.status(200).json({
      message: "Lấy danh sách xe của khách hàng thành công.",
      data: vehicles,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi lấy danh sách xe của khách hàng: ${error.message}`)
    );
  }
};

// Hàm này là nhân viên tìm xe cho khách hàng
exports.findVehicleForCustomer = async (req, res, next) => {
  try {
    const customer_id = req.params.customer_id;
    const vehicle = await vehicleService.getVehicleByUserId(customer_id);
    res.status(200).json({
      message: "Tìm xe thành công.",
      data: vehicle,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi tìm xe: ${error.message}`)
    );
  }
}