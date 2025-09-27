const MaintenanceService = require("../services/maintenance.service");
const ApiError = require("../middlewares/error.middleware");

exports.createMaintenance = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await MaintenanceService.createSchedule(data);

    res.send ({
      message: "tạo lịch bảo trì thành công",
      schedule: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi tạo lịch bảo trì ${error}`));
  }
};
