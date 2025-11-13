const OrderModel = require("../models/order.model");
const OrderDetailModel = require("../models/orderDetail.model");
const {
  format,
  parseISO,
  startOfMonth,
  addMonths,
  subMonths,
} = require("date-fns");
const { Sequelize, Op } = require("sequelize");
const DeliveryModel = require("../models/delivery.model");
const PaymentModel = require("../models/payment.model");
const UserModel = require("../models/user.model");
const ProductModel = require("../models/product.model");
const ProductColorModel = require("../models/productColor.model");
const CompanyModel = require("../models/company.model");

const orderCompletedInclude = [
  {
    model: DeliveryModel,
    as: "Delivery",
    required: true,
    attributes: [],
    where: {
      status: { [Op.eq]: "delivered" },
    },
  },
  {
    model: PaymentModel,
    as: "Payment",
    required: true,
    attributes: [],
    where: {
      status: { [Op.eq]: "completed" },
    },
  },
];

class ReportService {
  async getMonthStatistic(monthYear) {
    let targetMonth = monthYear;
    let compareMonth = null;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
      compareMonth = format(subMonths(new Date(), 1), "yyyy-MM");
    }

    if (monthYear > format(new Date(), "yyyy-MM")) {
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
        ...orderCompletedInclude,
        {
          model: OrderDetailModel,
          as: "OrderDetails",
        },
      ],
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((acc, cur) => acc + cur.totalAmount, 0);
    const aov = (orders.length > 0 ? totalRevenue / orders.length : 0).toFixed(
      2
    );

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
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(Number(targetYear) + 1, 0, 1);

    const monthlyRevenue = await OrderModel.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("Order.createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: orderCompletedInclude,
      group: [Sequelize.fn("MONTH", Sequelize.col("Order.createdAt"))],
      order: [[Sequelize.literal("month"), "ASC"]],
      subQuery: false,
    });

    if( monthlyRevenue.length === 0 ) {
      return null;
    }

    return monthlyRevenue;
  }

  async getProductStatistic(monthYear) {
    let targetMonth = monthYear;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
    }

    if (monthYear > format(new Date(), "yyyy-MM")) {
      return null;
    }

    const startDate = startOfMonth(parseISO(targetMonth));
    const endDate = addMonths(startDate, 1);

    const result = await this.getProductReportTable({ monthYear });

    const products = result.data;

    const totalProductSold = products.reduce(
      (acc, product) => acc + parseInt(product.totalSold || 0),
      0
    );

    // Tìm sản phẩm có tồn kho thấp nhất
    let lowestStockProduct = null;
    if (targetMonth === format(new Date(), "yyyy-MM")) {
      lowestStockProduct =
        products.length > 0
          ? products.reduce((prev, curr) => {
              return prev.totalStock < curr.totalStock ? prev : curr;
            })
          : null;
    }

    // Gom nhóm sản phẩm theo hãng xe
    const companyStats = await CompanyModel.findAll({
      attributes: [
        "company_id",
        "name",
        [
          Sequelize.fn(
            "COALESCE", // Hàm COALESCE
            Sequelize.fn(
              "SUM",
              Sequelize.col("Products.ProductColors.OrderDetails.quantity")
            ),
            0
          ),
          "totalSold",
        ],
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.literal(
                "`Products->ProductColors->OrderDetails`.`quantity` * `Products->ProductColors->OrderDetails`.`price`"
              )
            ),
            0
          ),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: ProductModel,
          as: "Products",
          required: false,
          attributes: [],
          include: [
            {
              model: ProductColorModel,
              as: "ProductColors",
              required: false,
              attributes: [],
              include: [
                {
                  model: OrderDetailModel,
                  as: "OrderDetails",
                  required: false,
                  attributes: [],
                  include: [
                    {
                      model: OrderModel,
                      as: "Order",
                      required: true,
                      attributes: [],
                      where: {
                        createdAt: {
                          [Op.gte]: startDate,
                          [Op.lt]: endDate,
                        },
                      },
                      include: orderCompletedInclude,
                    },
                  ],
                },
              ],
            },
            {
              model: CompanyModel,
              as: "Company",
              attributes: ["company_id", "name"],
            },
          ],
        },
      ],
      group: ["Company.company_id", "Company.name"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      subQuery: false,
    });

    return { products, totalProductSold, lowestStockProduct, companyStats };
  }

  async getProductReportTable(query) {
    const monthYear = query.monthYear;
    let targetMonth = monthYear;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
    }

    if (monthYear > format(new Date(), "yyyy-MM")) {
      return null;
    }

    const startDate = startOfMonth(parseISO(targetMonth));
    const endDate = addMonths(startDate, 1);

    const { keyword = "", page, limit } = query;
    const validPage = page ? Math.max(parseInt(page) || 1, 1) : null;
    const validLimit = limit ? Math.max(parseInt(limit) || 10, 10) : null;
    const offset =
      validPage && validLimit ? (validPage - 1) * validLimit : null;

    const { rows, count } = await ProductModel.findAndCountAll({
      attributes: [
        "product_id",
        "name",
        [
          Sequelize.fn(
            "SUM",
            Sequelize.col("ProductColors.OrderDetails.quantity")
          ),
          "totalSold",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              "`ProductColors->OrderDetails`.`quantity` * `ProductColors->OrderDetails`.`price`"
            )
          ),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: ProductColorModel,
          as: "ProductColors",
          required: true,
          attributes: [],
          include: [
            {
              model: OrderDetailModel,
              as: "OrderDetails",
              required: true,
              attributes: [],
              include: [
                {
                  model: OrderModel,
                  as: "Order",
                  required: true,
                  attributes: [],
                  where: {
                    createdAt: {
                      [Op.gte]: startDate,
                      [Op.lt]: endDate,
                    },
                  },
                  include: orderCompletedInclude,
                },
              ],
            },
          ],
        },
        {
          model: CompanyModel,
          as: "Company",
          attributes: ["company_id", "name"],
        },
      ],
      where: {
        name: { [Op.like]: `%${keyword}%` },
      },
      offset,
      limit: validLimit,
      distinct: true,
      group: ["Product.product_id", "Product.name"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      subQuery: false,
    });

    const stock = await ProductColorModel.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("stock_quantity")), "totalStock"],
      ],
      group: ["product_id"],
    });

    let finalRows = rows;

    if (!monthYear || monthYear === format(new Date(), "yyyy-MM")) {
      finalRows = rows.map((product) => {
        const stockInfo = stock.find(
          (s) => s.product_id === product.product_id
        );
        return {
          ...product.toJSON(),
          totalStock: stockInfo ? parseInt(stockInfo.dataValues.totalStock) : 0,
        };
      });
    }

    const totalItems = count.length;

    return {
      data: finalRows,
      total: totalItems,
      totalPages: Math.ceil(totalItems / validLimit),
    };
  }

  async getUserReportTable(query) {
    const { keyword = "", page, limit } = query;
    const validPage = page ? Math.max(parseInt(page) || 1, 1) : null;
    const validLimit = limit ? Math.max(parseInt(limit) || 10, 10) : null;
    const offset =
      validPage && validLimit ? (validPage - 1) * validLimit : null;

    const { rows, count } = await UserModel.findAndCountAll({
      attributes: [
        "user_id",
        "email",
        "phone",
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("last_name"),
            " ",
            Sequelize.col("first_name")
          ),
          "name",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("Orders.order_id")), "totalOrders"],
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "SUM",
              Sequelize.col("Orders.totalAmount")
            ),
            0
          ),
          "totalSpent",
        ],
        [Sequelize.fn("MAX", Sequelize.col("Orders.createdAt")), "lastOrder"]
      ],
      where: {
        role: { [Op.eq]: "user" },
        [Op.or]: [
          { email: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          Sequelize.where(
            Sequelize.fn(
              "concat",
              Sequelize.col("last_name"),
              " ",
              Sequelize.col("first_name")
            ),
            {
              [Op.like]: `%${keyword}%`,
            }
          ),
        ],
      },
      include: [
        {
          model: OrderModel,
          as: "Orders",
          required: false,
          attributes: [],
          include: orderCompletedInclude,
        },
      ],
      offset,
      limit: validLimit,
      distinct: true,
      group: ["User.user_id", "User.email", "User.phone", "User.first_name", "User.last_name"],
      order: [[Sequelize.literal("totalSpent"), "DESC"]],
      subQuery: false,
    });

    return {
      data: rows,
      total: count.length,
      totalPages: Math.ceil(count.length / validLimit),
    }
  }

  async getUserStatistic(monthYear) {
    let targetMonth = monthYear;

    if (!monthYear) {
      targetMonth = format(new Date(), "yyyy-MM");
    }

    if (monthYear > format(new Date(), "yyyy-MM")) {
      return null;
    }

    const lastMonth = format(subMonths(parseISO(targetMonth), 1), "yyyy-MM");

    const startDate = startOfMonth(parseISO(targetMonth));
    const endDate = addMonths(startDate, 1);

    const lastStartDate = startOfMonth(parseISO(lastMonth));
    const lastEndDate = addMonths(lastStartDate, 1);

    // Tổng người dùng trong hệ thống
    const { count } = await UserModel.findAndCountAll({
      where: {
        role: { [Op.eq]: "user" },
      },
    });

    // Tổng người dùng đăng ký trong tháng
    const { count: countInMonth } = await UserModel.findAndCountAll({
      where: {
        role: { [Op.eq]: "user" },
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    // Số người dùng quay lại
    const lastMonthUsers = await OrderModel.findAll({
      attributes: ["user_id"],
      distinct: true,
      where: {
        createdAt: {
          [Op.gte]: lastStartDate,
          [Op.lt]: lastEndDate,
        },
      },
      include: orderCompletedInclude,
    });

    const lastMonthUserIds = lastMonthUsers.map((user) => user.user_id);

    const { count: returnedUsersCount } = await UserModel.findAndCountAll({
      where: {
        role: { [Op.eq]: "user" },
      },
      attributes: [],
      distinct: true,
      col: "user_id",
      include: [
        {
          model: OrderModel,
          as: "Orders",
          required: true,
          attributes: [],
          where: {
            createdAt: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
            user_id: { [Op.in]: lastMonthUserIds },
          },
          include: orderCompletedInclude,
        },
      ],
    });

    // Tìm khách hàng vip
    const orders = await OrderModel.findAll({
      group: ["user_id", "name"],
      attributes: [
        "user_id",
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalSpent"],
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("User.last_name"),
            " ",
            Sequelize.col("User.first_name")
          ),
          "name",
        ],
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        ...orderCompletedInclude,
        {
          model: UserModel,
          as: "User",
          required: true,
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
      order: [[Sequelize.literal("totalSpent"), "DESC"]],
      subQuery: false,
    });

    // Lấy dữ liệu tháng làm chart
    const newUserChart = await UserModel.findAll({
      attributes: [
        [Sequelize.fn("DAY", Sequelize.col("User.createdAt")), "day"],
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"]
      ],
      where: {
        role: { [Op.eq]: "user" },
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      group: ["day"],
      order: [["day", "ASC"]],
      raw: true,
    })

    const vipUser = orders.length > 0 ? orders[0] : null;

    return {
      totalUsers: count,
      totalUsersInMonth: countInMonth,
      returnedUsersCount,
      vipUser,
      newUserChart,
    };
  }
}
module.exports = new ReportService();
