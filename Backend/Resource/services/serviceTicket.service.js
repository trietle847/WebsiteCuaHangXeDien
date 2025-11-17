const {
  ServiceTicket: ServiceTicketModel,
  ServiceDetail: ServiceDetailModel,
  Vehicle: VehicleModel,
  User: UserModel,
  ProductColor: ProductColorModel,
  Product: ProductModel,
} = require("../models/associations");

const { sendMail } = require("../utils/mail");
<<<<<<< HEAD
const { addMonths, startOfDay, endOfDay, parseISO } = require("date-fns");
=======
const {
  addMonths,
  startOfDay,
  endOfDay,
  parseISO,
} = require("date-fns");
>>>>>>> 71ee04052ad983ffe5ad37ddf72ce22a09120f26
const { Sequelize, Op, fn } = require("sequelize");
require("dotenv").config();

function getNextMaintenanceDate(purchaseDate, intervalMonths) {
  const nextDate = addMonths(new Date(purchaseDate), intervalMonths);
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
  async getAllTickets(query) {
    const { keyword = "", page = 1, limit = 10 } = query;

    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 1, 1);
    const offset = (validPage - 1) * validLimit;

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
      ];
    }

    const includeOptions = [
      {
        model: VehicleModel,
        as: "Vehicle",
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
      }
    ];

    const { count, rows } = await ServiceTicketModel.findAndCountAll({
      where: whereOptions,
      include: includeOptions,
      offset: offset,
      limit: validLimit,
    });

    return {
      total: count,
      totalPages: Math.ceil(count / validLimit),
      data: rows,
    };
  }

  // Tạo lịch bảo dưỡng dựa trên chính sách bảo dưỡng của sản phẩm
  async createTicketByPolicy(vehicle_id) {
    const vehicle = await VehicleModel.findByPk(vehicle_id, {
      include: [
        {
          model: UserModel,
          as: "User",
        },
      ],
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
      const newTicket = await ServiceTicketModel.create({
        vehicle_id: vehicle_id,
        customer_id: vehicle.user_id, // customer_id thay vì user_id vì quan hệ KH - vé dịch vụ
        type: "maintenance",
        expected_date: expected_date,
        status: "pending",
      });
      // Để trước hạng mục dịch vụ từ chính sách
      await ServiceDetailModel.create({
        serviceTicket_id: newTicket.serviceTicket_id,
        content: next_maintenance.task || "Sẽ cập nhật sau",
        price: 0,
      });
      await newTicket.reload();
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
    } else if (data.customer_id) {
      // TH phiếu này được tạo bởi nhân viên CSKH hoặc thợ
      customer_id = data.customer_id;
      mechanic_id = user.user_id;
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
    await this.validateTicketData(data);

    const ticket = await ServiceTicketModel.findByPk(serviceTicket_id);

    if (!ticket) {
      throw new Error("Không tìm thấy phiếu dịch vụ.");
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
    const vehicle = await VehicleModel.findByPk(data.vehicle_id);
    if (!vehicle) {
      throw new Error("Xe không tồn tại.");
    }

    if (!validTicketTypes.includes(data.type)) {
      throw new Error("Loại vé dịch vụ không hợp lệ.");
    }
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error("Trạng thái vé dịch vụ không hợp lệ.");
    }
  }
}

module.exports = new ServiceTicketService();
