const ServiceTicketModel = require("../models/serviceTicket.model")
const ServiceTicketService = require("../services/serviceTicket.service")
const VehicleModel = require("../models/vehicle.model")
const ProductColorModel = require("../models/productColor.model")
const ProductModel = require("../models/product.model")
const UserModel = require("../models/user.model")
const { Op } = require("sequelize")
const {addDays, startOfDay, endOfDay, format} = require("date-fns")

const findUpcomingMaintenances = async () => {
    const today = new Date();
    const targetDate = addDays(today, 7); // 7 ngày tới
    const targetDateString = format(targetDate, "yyyy-MM-dd");
    console.log("Tìm các lịch bảo trì định kỳ vào ngày:", targetDateString);
    // Tìm và chỉ gửi 1 lần cho các lịch bảo trì định kỳ sắp tới
    const tickets = await ServiceTicketModel.findAll({
        where: {
            expected_date: targetDateString,
            status: "pending",
            type: "maintenance"
        },
        include: [
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
                                as: "Product"
                            }
                        ]
                    }
                ]
            },
            {
                model: UserModel,
                as: "Customer"
            }
        ]
    });

    if (tickets.length === 0) {
        console.log("Không có lịch bảo trì định kỳ nào trong 7 ngày tới.");
        return;
    }

    console.log(`Tìm thấy ${tickets.length} lịch bảo trì định kỳ trong 7 ngày tới. Đang gửi email nhắc nhở...`);

    const reminders = tickets.map(async (ticket) => {
        await ServiceTicketService.sendPeriodicMaintenanceReminder(ticket, ticket.Vehicle, ticket.Customer);
    });

    await Promise.all(reminders);

    console.log("Đã gửi email nhắc nhở cho tất cả lịch bảo trì định kỳ sắp tới.");
}

module.exports = { findUpcomingMaintenances }