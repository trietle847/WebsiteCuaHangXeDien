const OrderModel = require("../models/order.model");
const {
  format,
  parseISO,
  startOfMonth,
  addMonths,
  subMonths,
} = require("date-fns");
const { Op } = require("sequelize");
const DeliveryModel = require("../models/delivery.model");
const PaymentModel = require("../models/payment.model");

class ReportService {
  async getMonthStatistic(monthYear) {
    let targetMonth = monthYear;
    let compareMonth = null;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
      compareMonth = format(subMonths(new Date(), 1), "yyyy-MM");
    }

    const startDate = startOfMonth(parseISO(targetMonth));
    const endDate = addMonths(startDate, 1);

    const orders = await OrderModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: DeliveryModel,
          as: "Delivery",
          where: {
            status: { [Op.ne]: "failed" },
          },
        },
        {
          model: PaymentModel,
          as: "Payment",
          where: {
            status: { [Op.ne]: "failed" },
          },
        },
      ],
    });

    const totalOrders = orders.length;

    const completedOrders = orders.filter(
      (order) => order.Payment && order.Payment.status === "completed"
    );
    const totalRevenue = completedOrders.reduce(
      (acc, cur) => acc + cur.totalAmount,
      0
    );

    let change = {};

    if (compareMonth) {
      const compareStartDate = startOfMonth(parseISO(compareMonth));
      const compareEndDate = addMonths(compareStartDate, 1);
      const compareOrders = await OrderModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: compareStartDate,
            [Op.lt]: compareEndDate,
          },
        },
        include: [
          {
            model: DeliveryModel,
            as: "Delivery",
            where: {
              status: { [Op.ne]: "failed" },
            },
          },
          {
            model: PaymentModel,
            as: "Payment",
            where: {
              status: { [Op.ne]: "failed" },
            },
          },
        ],
      });

      const compareTotalOrders = compareOrders.length;

      const compareCompletedOrders = compareOrders.filter(
        (order) => order.Payment && order.Payment.status === "completed"
      );
      const compareTotalRevenue = compareCompletedOrders.reduce(
        (acc, cur) => acc + cur.totalAmount,
        0
      );
      if (compareTotalOrders !== 0 || compareTotalRevenue !== 0) {
        change = {
          totalOrders:
            compareTotalOrders !== 0
              ? Number(
                  (
                    ((totalOrders - compareTotalOrders) / compareTotalOrders) *
                    100
                  ).toFixed(2)
                )
              : 0,
          totalRevenue:
            compareTotalRevenue !== 0
              ? Number(
                  (
                    ((totalRevenue - compareTotalRevenue) /
                      compareTotalRevenue) *
                    100
                  ).toFixed(2)
                )
              : 0,
        };
      }
    }

    return { totalOrders, totalRevenue, change };
  }
}

module.exports = new ReportService();
