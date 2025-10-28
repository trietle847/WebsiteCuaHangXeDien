const ApiError = require("../middlewares/error.middleware");
const RepairService = require("../services/repairSchedule.service");

exports.createRepairSchedule = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user.user_id;

    const response = await RepairService.createRepairSchedule({
      ...data,
      customer_id: userId,
    });

    res.send({
      message: "Đăng ký sửa xe thành công",
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi đăng ký sửa xe ${error}`);
  }
};

exports.getRepairSchedule = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const response = await RepairService.getRepairSchedule(userId);
    res.send({
      message: "Danh sách lịch đã đăng ký",
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi lấy thông tin lịch sửa xe ${error}`);
  }
};

exports.getTimeRepairOfMechanic = async (req, res, next) => {
  try {
    const mechanicId = req.query.mechanic_id;
    const date = req.query.repair_date;

    const response = await RepairService.getTimeRepairOfMechanic(
      mechanicId,
      date
    );

    res.send({
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi lấy thông tin lịch sửa xe ${error}`);
  }
};
