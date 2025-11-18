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