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
