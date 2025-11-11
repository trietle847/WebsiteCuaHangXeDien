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
    const monthlyRevenue = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(targetYear, month, 1);
      const endDate = new Date(targetYear, month + 1, 1);
      if (startDate > new Date()) {
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

      const totalRevenue = orders.reduce(
        (acc, cur) => acc + cur.totalAmount,
        0
      );
      monthRevenue.revenue = totalRevenue;
      monthlyRevenue.push(monthRevenue);
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

    const products = await ProductModel.findAll({
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
                  include: [
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
                  ],
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
      group: ["Product.product_id", "Product.name"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      subQuery: false,
    });

    const totalProductSold = products.reduce(
      (acc, product) => acc + parseInt(product.get("totalSold") || 0),
      0
    );

    // Tìm sản phẩm có tồn kho thấp nhất
    let lowestStockProduct = null;
    if (targetMonth === format(new Date(), "yyyy-MM")) {
      const allProducts = await ProductModel.findAll({
        attributes: [
          "product_id",
          "name",
          [
            Sequelize.fn("SUM", Sequelize.col("ProductColors.stock_quantity")),
            "totalStock",
          ],
        ],
        include: [
          {
            model: ProductColorModel,
            as: "ProductColors",
            required: true,
            attributes: [],
          },
        ],
        group: ["Product.product_id", "Product.name"],
        order: [[Sequelize.literal("totalStock"), "ASC"]],
        subQuery: false,
      });

      lowestStockProduct = allProducts.length > 0 ? allProducts[0] : null;
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
                      include: [
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
                      ],
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

    const { keyword = "", page = 1, limit = 10 } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 10, 10);
    const offset = (validPage - 1) * validLimit;

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
                  include: [
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
                  ],
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
    })

    let finalRows = rows;

    if(!monthYear || monthYear === format(new Date(), "yyyy-MM")) {
      finalRows = rows.map((product) => {
        const stockInfo = stock.find((s) => s.product_id === product.product_id);
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
}
module.exports = new ReportService();
