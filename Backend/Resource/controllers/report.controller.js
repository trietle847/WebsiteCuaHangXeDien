const reportService = require("../services/report.service");

class ReportController {
  async getMonthStatistic(req, res, next) {
    const { monthYear } = req.query;

    try {
      const report = await reportService.getMonthStatistic(monthYear);
      return res.json({message: "Thống kê báo cáo tháng " + monthYear, data: report});
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Lỗi khi lấy báo cáo tháng ${monthYear}: ${error}`));
    }
  }
}

module.exports = new ReportController();
