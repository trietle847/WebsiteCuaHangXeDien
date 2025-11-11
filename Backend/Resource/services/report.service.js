const OrderModel = require("../models/order.model");
const OrderDetailModel = require("../models/orderDetail.model");
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
const UserModel = require("../models/user.model");

class ReportService {
  async getMonthStatistic(monthYear) {
    let targetMonth = monthYear;
    let compareMonth = null;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
      compareMonth = format(subMonths(new Date(), 1), "yyyy-MM");
    }

    if( monthYear > format(new Date(), "yyyy-MM")) {
      return null;
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
            status: { [Op.eq]: "delivered" },
          },
        },
        {
          model: PaymentModel,
          as: "Payment",
          where: {
            status: { [Op.eq]: "completed" },
          },
        },
        {
          model: OrderDetailModel,
          as: "OrderDetails",
        },
      ],
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
    const aov = (orders.length > 0 ? totalRevenue / orders.length : 0).toFixed(2);

    const newUsers = await UserModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
        role: { [Op.eq]: "user" },
      },
    });

    const totalUsers = newUsers.length;

    const totalProductsSold = orders.reduce((acc, order) => {
      const productsInOrder = order.OrderDetails.reduce(
        (prodAcc, detail) => prodAcc + detail.quantity,
        0
      );
      return acc + productsInOrder;
    }, 0);

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
              status: { [Op.eq]: "delivered" },
            },
          },
          {
            model: PaymentModel,
            as: "Payment",
            where: {
              status: { [Op.eq]: "completed" },
            },
          },
          {
            model: OrderDetailModel,
            as: "OrderDetails",
          },
        ],
      });

      const compareTotalOrders = compareOrders.length;

      const compareTotalRevenue = compareOrders.reduce(
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

          aov:
            compareOrders.length !== 0
              ? Number(
                  (
                    ((aov - compareTotalRevenue / compareOrders.length) /
                      (compareTotalRevenue / compareOrders.length)) *
                    100
                  ).toFixed(2)
                )
              : 0,
        };
      }

      const comparedNewUsers = await UserModel.findAll({
        where: {
          createdAt: {
            [Op.gte]: compareStartDate,
            [Op.lt]: compareEndDate,
          },
          role: { [Op.eq]: "user" },
        },
      });

      const comparedTotalUsers = comparedNewUsers.length;

      if (comparedTotalUsers !== 0) {
        change.totalUsers = Number(
          (
            ((totalUsers - comparedTotalUsers) / comparedTotalUsers) *
            100
          ).toFixed(2)
        );
      } else {
        change.totalUsers = 0;
      }

      const comparedTotalProductsSold = compareOrders.reduce((acc, order) => {
        const productsInOrder = order.OrderDetails.reduce(
          (prodAcc, detail) => prodAcc + detail.quantity,
          0
        );
        return acc + productsInOrder;
      }, 0);

      if (comparedTotalProductsSold !== 0) {
        change.totalProductsSold = Number(
          (
            ((totalProductsSold - comparedTotalProductsSold) /
              comparedTotalProductsSold) *
            100
          ).toFixed(2)
        );
      } else {
        change.totalProductsSold = 0;
      }
    }

    return {
      totalOrders,
      totalRevenue,
      aov,
      totalUsers,
      totalProductsSold,
      change,
    };
  }

  async getAnnualRevenue(year) {
    const targetYear = year || format(new Date(), "yyyy");
    const monthlyRevenue = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(targetYear, month, 1);
      const endDate = new Date(targetYear, month + 1, 1);
      if(startDate > new Date()) {
        break;
      }
      const monthRevenue = {
        name: `T${month + 1}`,
        revenue: 0,
      };
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
              status: { [Op.eq]: "delivered" },
            },
          },
          {
            model: PaymentModel,
            as: "Payment",
            where: {
              status: { [Op.eq]: "completed" },
            },
          },
        ],
      });

      const totalRevenue = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
      monthRevenue.revenue = totalRevenue;
      monthlyRevenue.push(monthRevenue);
    }

    return monthlyRevenue;
  }
}
module.exports = new ReportService();
