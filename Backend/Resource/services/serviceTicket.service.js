const e = require("express");
const {
  ServiceTicket: ServiceTicketModel,
  ServiceDetail: ServiceDetailModel,
  Vehicle: VehicleModel,
  User: UserModel,
  ProductColor: ProductColorModel,
  Product: ProductModel,
  Color: ColorModel,
} = require("../models/associations");

const { sendMail } = require("../utils/mail");
const { addMonths, startOfDay, endOfDay, parseISO } = require("date-fns");
const { Sequelize, Op, fn, literal } = require("sequelize");
require("dotenv").config();

function getNextMaintenanceDate(purchaseDate, intervalMonths) {
  const month = parseInt(intervalMonths, 10);
  if (isNaN(month) || month <= 0) {
    throw new Error("Khoảng thời gian bảo dưỡng không hợp lệ.");
  }
  if (!purchaseDate || !(purchaseDate instanceof Date)) {
    throw new Error("Ngày mua không hợp lệ.");
  }
  if (month / 12 > 100) {
    throw new Error(`Khoảng thời gian bảo dưỡng quá lớn. (~${month / 12} năm)`);
  }
  const nextDate = addMonths(new Date(purchaseDate), month);
  return nextDate;
}

const validStatuses = [
  "pending",
  "confirmed",
  "inProgress",
  "completed",
  "closed",
  "cancelled",
  "expired",
  "noShow",
];

const validTicketTypes = ["maintenance", "repair", "warranty"];

class ServiceTicketService {
  async getAllTickets(query, user) {
    const { keyword = "", page = 1, limit = 10 } = query;

    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;

    const dateCol =
      "COALESCE(`ServiceTicket`.`confirmed_date_time`, `ServiceTicket`.`expected_date`)"; 

    const whereOptions = {};
    if (keyword) {
      whereOptions[Op.or] = [
        { "$Vehicle.vin$": { [Op.like]: `%${keyword}%` } },
        Sequelize.where(
          Sequelize.fn(
            "CONCAT",
            Sequelize.col("Customer.last_name"),
            " ",
            Sequelize.col("Customer.first_name")
          ),
          {
            [Op.like]: `%${keyword}%`,
          }
        ),
        { serviceTicket_id: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (user && user.role === "mechanic") {
      whereOptions.mechanic_id = user.user_id;
    }

    const includeOptions = [
      {
        model: VehicleModel,
        as: "Vehicle",
        include: [
          {
            model: ProductColorModel,
            as: "ProductColor",
            include: [
              {
                model: ProductModel,
                as: "Product",
              },
              {
                model: ColorModel,
                as: "Color",
              },
            ],
          },
        ],
      },
      {
        model: UserModel,
        as: "Customer",
      },
      {
        model: UserModel,
        as: "Mechanic",
      },
      {
        model: ServiceDetailModel,
        as: "ServiceDetails",
      },
    ];

    const { count, rows } = await ServiceTicketModel.findAndCountAll({
      include: includeOptions,
      where: whereOptions,
      offset: offset,
      limit: validLimit,
      subQuery: false,
      distinct: true,
      order: [
        // --- Nhóm 1: Priority Group ---
        [
          literal(`
        CASE 
          WHEN \`ServiceTicket\`.\`status\` IN ('inProgress', 'confirmed', 'pending') THEN 1 
          WHEN \`ServiceTicket\`.\`status\` = 'completed' THEN 2 
          ELSE 3 
        END
      `),
          "ASC",
        ],

        // --- Nhóm 2: Sort ASC cho Active ---
        [
          literal(`
        CASE 
          WHEN \`ServiceTicket\`.\`status\` IN ('inProgress', 'confirmed', 'pending') 
          THEN ${dateCol} 
          ELSE NULL 
        END
      `),
          "ASC",
        ],

        // --- Nhóm 3: Sort DESC cho Completed/History ---
        [
          literal(`
        CASE 
          WHEN \`ServiceTicket\`.\`status\` NOT IN ('inProgress', 'confirmed', 'pending') 
          THEN ${dateCol} 
          ELSE NULL 
        END
      `),
          "DESC",
        ],
      ],
    });

    return {
      total: count,
      totalPages: Math.ceil(count / validLimit),
      data: rows,
    };
  }

  async getTicketByCustomerId(customer_id) {
    const tickets = await ServiceTicketModel.findAll({
      where: {
        customer_id: customer_id,
      },
      include: [
        {
          model: VehicleModel,
          as: "Vehicle",
        },
        {
          model: ServiceDetailModel,
          as: "ServiceDetails",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return tickets;
  }

  // Tạo lịch bảo dưỡng dựa trên chính sách bảo dưỡng của sản phẩm
  async createTicketByPolicy(vehicle_id, transaction = null) {
    const vehicle = await VehicleModel.findByPk(vehicle_id, {
      include: [
        {
          model: UserModel,
          as: "User",
        },
      ],
      transaction,
    });
    if (!vehicle) {
      throw new Error("Không tìm thấy xe");
    }
    const maintenance_policy = vehicle.maintenance_policy;
    if (!maintenance_policy) {
      return;
    }
    const maintenanceTickets = await ServiceTicketModel.findAll({
      where: {
        vehicle_id: vehicle_id,
        type: "maintenance",
      },
      transaction,
      order: [["createdAt", "DESC"]], // Sắp xếp phiếu bảo dưỡng gần nhất
    });
    let next_maintenance = null;
    const purchaseDate = vehicle.createdAt; // Vehicle được tạo khi mua xe thành công
    if (!maintenanceTickets || maintenanceTickets.length === 0) {
      // Chưa có phiếu bảo dưỡng nào => tạo phiếu đầu tiên dựa trên chính sách
      next_maintenance = maintenance_policy[0];
    } else if (
      maintenanceTickets[0].status === "expired" ||
      maintenanceTickets[0].status === "noShow" ||
      maintenanceTickets.length === maintenance_policy.length
    ) {
      // Phiếu bảo dưỡng gần nhất đã hết hạn hoặc khách hàng không đến hoặc đã tạo đủ phiếu theo chính sách => dừng, không tạo phiếu mới
      return;
    } else if (maintenanceTickets.length < maintenance_policy.length) {
      // Tạo phiếu bảo dưỡng tiếp theo dựa trên chính sách
      next_maintenance = maintenance_policy[maintenanceTickets.length];
    }
    if (next_maintenance) {
      const expected_date = getNextMaintenanceDate(
        purchaseDate,
        next_maintenance.interval_months
      );
      const newTicket = await ServiceTicketModel.create(
        {
          vehicle_id: vehicle_id,
          customer_id: vehicle.user_id, // customer_id thay vì user_id vì quan hệ KH - vé dịch vụ
          type: "maintenance",
          expected_date: expected_date,
          status: "pending",
        },
        { transaction }
      );
      // Để trước hạng mục dịch vụ từ chính sách
      await ServiceDetailModel.create(
        {
          serviceTicket_id: newTicket.serviceTicket_id,
          content: next_maintenance.task || "Sẽ cập nhật sau",
          price: 0,
        },
        { transaction }
      );
      await newTicket.reload({ transaction });
      return newTicket;
    }
  }

  // Tìm các khung giờ đã được đặt trong ngày và tính toán các khung giờ còn trống
  async getScheduleSlots(date) {
    const targetDate = parseISO(date);
    const startDate = startOfDay(targetDate);
    const endDate = endOfDay(targetDate);

    const { count: mechanicsCount } = await UserModel.findAndCountAll({
      where: {
        role: "mechanic",
      },
    });

    // Tại 1 khung giờ, số vé dịch vụ tối đa bằng số lượng thợ
    // Giả sử 1 khung giờ, tối thiểu có thể tiếp nhận 5 khách
    const slotCapacity = Math.max(5, mechanicsCount || 0);
    const allPossibleSlots = [8, 9, 10, 11, 13, 14, 15, 16]; // Giờ làm việc (bỏ qua giờ nghỉ trưa)

    const bookedSlots = await ServiceTicketModel.findAll({
      where: {
        confirmed_date_time: {
          [Op.between]: [startDate, endDate],
        },
        status: { [Op.in]: ["confirmed", "inProgress"] },
      },
      attributes: [
        [fn("HOUR", Sequelize.col("confirmed_date_time")), "hour"],
        [fn("COUNT", Sequelize.col("serviceTicket_id")), "bookingCount"],
      ],
      group: ["hour"],
      raw: true,
    });

    const bookingMap = new Map();
    bookedSlots.forEach((slot) => {
      bookingMap.set(slot.hour, slot.bookingCount);
    });

    const availableSlots = allPossibleSlots.map((hour) => {
      const bookingCount = bookingMap.get(hour) || 0;
      const available = slotCapacity - bookingCount;
      return {
        hour,
        booked: bookingCount,
        available: available,
        isFull: available <= 0,
      };
    });

    return availableSlots;
  }

  async createTicket(data, user) {
    let customer_id = null;
    let mechanic_id = null;
    // TH phiếu này được tạo bởi khách hàng
    if (user.role === "user") {
      customer_id = user.user_id;
    } else if (user.role === "mechanic") {
      // TH phiếu này được tạo bởi thợ
      customer_id = data.customer_id;
      mechanic_id = user.user_id;
    } else {
      customer_id = data.customer_id;
      mechanic_id = data.mechanic_id;
    }
    if (!customer_id) {
      throw new Error("Thiếu thông tin khách hàng để tạo phiếu dịch vụ.");
    }

    await this.validateTicketData(data);

    const ticket = await ServiceTicketModel.create({
      ...data,
      customer_id: customer_id,
      mechanic_id: mechanic_id,
      status: data.status || "confirmed",
    });
    return ticket;
  }

  async updateTicket(serviceTicket_id, data) {
    const ticket = await ServiceTicketModel.findByPk(serviceTicket_id, {
      include: [
        {
          model: VehicleModel,
          as: "Vehicle",
        },
      ],
    });

    if (!ticket) {
      throw new Error("Không tìm thấy phiếu dịch vụ.");
    }

    if (data.mechanic_id) {
      const mechanic = await UserModel.findByPk(data.mechanic_id);
      if (!mechanic || mechanic.role !== "mechanic") {
        throw new Error("Không tìm thấy kỹ thuật viên.");
      }
    }

    if (data.status === "inProgress" && ticket.status !== "inProgress") {
      const check_in_time = new Date();
      data.check_in_time = check_in_time;
    }

    if (data.status === "completed" && ticket.status !== "completed") {
      const completed_time = new Date();
      data.completed_time = completed_time;
      const details = data.details || [];
      if (details.length > 0) {
        const serviceDetails = details.map((detail) => ({
          serviceTicket_id: serviceTicket_id,
          content: detail.content,
          price: detail.price,
          note: detail.note,
        }));
        await ServiceDetailModel.bulkCreate(serviceDetails);
        data.total_price = serviceDetails.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
      }
    }

    if (data.status === "closed" && ticket.status !== "closed") {
      const closed_time = new Date();
      data.closed_time = closed_time;
    }

    await ticket.update(data);
    await ticket.reload();

    if (
      ticket.type === "maintenance" &&
      data.status === "closed" &&
      ticket.expected_date
    ) {
      // Khi đóng phiếu bảo dưỡng, tự động tạo phiếu bảo dưỡng tiếp theo nếu có trong chính sách
      await this.createTicketByPolicy(ticket.vehicle_id);
    }

    return ticket;
  }

  // Hàm gửi email nhắc nhở bảo dưỡng định kỳ
  async sendPeriodicMaintenanceReminder(ticket, vehicle, customer) {
    try {
      if (!vehicle || !customer) {
        throw new Error("Không tìm thấy thông tin xe hoặc khách hàng.");
      }
      const maintenance_policy = vehicle.maintenance_policy;
      if (
        !Array.isArray(maintenance_policy) ||
        maintenance_policy.length === 0
      ) {
        return; // Không có chính sách, không làm gì
      }

      // Sắp xếp chính sách (giống code cũ của bạn, rất tốt)
      const sortedPolicy = [...maintenance_policy].sort(
        (a, b) => a.interval_months - b.interval_months
      );

      // Tìm xem ticket này khớp với "mốc" (milestone) nào
      // So sánh "expected_date" của ticket với "interval_months" của chính sách
      let maintenanceIndex = -1;

      // Tìm tất cả các vé bảo dưỡng của xe này
      const allMaintenanceTickets = await ServiceTicketModel.findAll({
        where: {
          vehicle_id: ticket.vehicle_id,
          type: "maintenance",
        },
        order: [["expected_date", "ASC"]], // Sắp xếp theo ngày dự kiến
      });

      // Tìm xem ticket này là vé thứ mấy
      const currentIndexInHistory = allMaintenanceTickets.findIndex(
        (t) => t.serviceTicket_id === ticket.serviceTicket_id
      );

      if (
        currentIndexInHistory !== -1 &&
        currentIndexInHistory < sortedPolicy.length
      ) {
        // Chỉ số của mốc bảo dưỡng chính là chỉ số trong lịch sử
        maintenanceIndex = currentIndexInHistory;
      }

      if (maintenanceIndex !== -1) {
        const nextMaintenance = maintenance_policy[maintenanceIndex];
        let maintenanceContent = "";
        if (maintenanceIndex === 0) {
          maintenanceContent = `Đây là lần bảo dưỡng đầu tiên cho xe của quý khách. Việc bảo dưỡng định kỳ giúp xe vận hành ổn định và kéo dài tuổi thọ.`;
        } else {
          maintenanceContent = `Đây là lần bảo dưỡng định kỳ thứ ${
            maintenanceIndex + 1
          }, khoảng ${
            nextMaintenance.interval_months -
            maintenance_policy[maintenanceIndex - 1].interval_months
          } tháng kể từ lần bảo dưỡng trước. Việc bảo dưỡng đúng lịch giúp xe luôn hoạt động tốt và an toàn.`;
        }
        const mailOptions = {
          to: process.env.EMAIL_USER, // Thay bằng customer.email khi chạy thực tế
          subject: `[Emotor] Nhắc nhở bảo dưỡng định kỳ lần ${
            maintenanceIndex + 1
          }`,
          text:
            `Kính gửi quý khách ${customer.last_name} ${customer.first_name},\n\n` +
            `Xe ${vehicle.ProductColor.Product.name} (Số khung: ${
              vehicle.vin
            }) của quý khách sắp đến hạn bảo dưỡng định kỳ lần ${
              maintenanceIndex + 1
            }.\n` +
            `${maintenanceContent}\n` +
            `Quý khách có thể truy cập vào trang web hoặc liên hệ với chúng tôi để đặt lịch hẹn.\n` +
            `<Link đặt lịch hẹn>\n` +
            `Chúng tôi rất mong được phục vụ quý khách!\n\n` +
            `Trân trọng,\n` +
            `Emotor`,
        };
        await sendMail(mailOptions.to, mailOptions.subject, mailOptions.text);
      }
    } catch (error) {
      console.error("Gửi mail thất bại:", error);
    }
  }

  async validateTicketData(data) {
    const vehicle = await VehicleModel.findByPk(data.vehicle_id, {
      include: [
        {
          model: ServiceTicketModel,
          as: "ServiceTickets",
        },
      ],
    });
    if (!vehicle) {
      throw new Error("Xe không tồn tại.");
    }

    if (!validTicketTypes.includes(data.type)) {
      throw new Error("Loại vé dịch vụ không hợp lệ.");
    }
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error("Trạng thái vé dịch vụ không hợp lệ.");
    }

    // Kiểm tra xe đã có vé dịch vụ đang chờ xử lý hay không
    if (
      vehicle.ServiceTickets.some((ticket) =>
        ["confirmed", "inProgress"].includes(ticket.status)
      )
    ) {
      throw new Error("Xe đã có vé dịch vụ đang chờ xử lý.");
    }
  }
}

module.exports = new ServiceTicketService();
