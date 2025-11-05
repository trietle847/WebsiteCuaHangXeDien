const OrderModel = require("../models/order.model");
const { parseISO, startOfMonth, addMonths } = require("date-fns");
const { Op } = require("sequelize");

class ReportService {
  async getMonthStatistic(monthYear) {
    const startDate = startOfMonth(parseISO(monthYear));
    const endDate = addMonths(startDate, 1);

    const orders = await OrderModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);

    return { totalOrders, totalRevenue };
  }
}

module.exports = new ReportService();
