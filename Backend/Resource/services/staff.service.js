const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { sendMail } = require("../utils/mail");
const slugify = require("slugify");
require("dotenv").config();
const sequelize = require("sequelize");
const ServiceTicketModel = require("../models/serviceTicket.model");

const staffRoles = ["mechanic", "sale_staff", "store_keeper"];

const isValidRole = (role) => {
  return staffRoles.includes(role);
};

async function generateStaffUsername(firstname) {
  // 1. Lấy tên cuối và chuẩn hóa
  const nameParts = (firstname || "").trim().split(/\s+/);
  const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : "";
  const normalizedLastName =
    slugify(lastName, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }) || "staff"; // Dự phòng

  // 2. Lấy 2 số cuối của năm hiện tại
  const currentYear = new Date().getFullYear();
  const yearSuffix = String(currentYear).slice(-2); // Ví dụ: "25"

  // 3. Tìm số tài khoản nhân viên đã tạo trong năm
  let nearestId = 1;
  await UserModel.findAndCountAll({
    distinct: true,
    where: {
      role: { [Op.in]: staffRoles },
    },
  }).then((lastUser) => {
    if (lastUser && lastUser.count) {
      nearestId = lastUser.count + 1;
    }
  });

  // 4. Kết hợp các phần
  const sequenceStr = nearestId.toString().padStart(4, "0"); // VD: 1 -> "0001"
  const username = `${normalizedLastName}es${yearSuffix}${sequenceStr}`;

  //VD: nguyen van a -> aes25001, es nghĩa là emotor staff

  return username;
}

class StaffService {
  async getAllStaff(query) {
    const { keyword = "", page = 1, limit = 10 } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 10, 10); // Đảm bảo ít nhất là 10
    const offset = (validPage - 1) * validLimit;
    const { count, rows } = await UserModel.findAndCountAll({
      attributes: {
        exclude: ["password", "token_hash", "token_expires_at"],
      },
      distinct: true,
      where: {
        [Op.and]: [
          { role: { [Op.in]: staffRoles } },
          {
            [Op.or]: [
              // Nhân viên có thể tìm kiếm theo username (xem như mã nhân viên)
              { username: { [Op.like]: `%${keyword}%` } },
              { email: { [Op.like]: `%${keyword}%` } },
              // Tìm kiếm theo họ và tên ghép lại
              sequelize.where(
                sequelize.fn(
                  "concat",
                  sequelize.col("last_name"),
                  " ",
                  sequelize.col("first_name")
                ),
                {
                  [Op.like]: `%${keyword}%`,
                }
              ),
            ],
          },
        ],
      },
      offset,
      limit: validLimit,
    });
    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / validLimit),
    };
  }

  async createStaff(userData) {
    if (!isValidRole(userData.role)) {
      throw new Error("Vai trò không hợp lệ");
    }

    // Sử dụng mã token ngẫu nhiên để kích hoạt tài khoản
    const token = crypto.randomBytes(32).toString("hex");
    //Hash token trước khi lưu vào database
    const hashToken = await bcrypt.hash(token, 10);

    const username = await generateStaffUsername(userData.first_name);

    const newUser = await UserModel.create({
      ...userData,
      username: username, // username là email để nhân viên dễ nhớ
      password: null, // Chưa đặt mật khẩu
      login_type: "local",
      status: "inactive",
      token_hash: hashToken,
      token_expires_at: Date.now() + 24 * 60 * 60 * 1000, // Hết hạn trong 24 giờ
    });

    if (!process.env.EMAIL_USER) {
      throw new Error("Chưa cấu hình email gửi trong biến môi trường");
    }

    const activationLink = `http://localhost:3001/request?token=${token}`;
    sendMail(
      process.env.EMAIL_USER,
      "[Emotor] Kích hoạt tài khoản nhân viên",
      `Xin chào ${userData.first_name},\n\n` +
        `Bạn đã được cấp tài khoản nhân viên tại Emotor.\n` +
        `Tên đăng nhập của bạn là: ${username}\n\n` +
        `Vui lòng kích hoạt tài khoản bằng cách truy cập:\n` +
        `${activationLink}\n\n` +
        `Link này sẽ hết hạn sau 24 giờ.`
    );

    const { password, hash_token, token_expires_at, ...safeUser } = newUser;

    return {
      message: "Tạo nhân viên thành công! Mail kích hoạt tài khoản đã được gửi",
      user: safeUser,
    };
  }

  async createAdmin() {
    const user = await UserModel.findOne({ where: { role: "admin" } });
    if (user) return;
    const hashPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "admin123",
      10
    );
    const payload = {
      username: process.env.ADMIN_USERNAME || "admin",
      password: hashPassword,
      role: "admin",
      email: process.env.EMAIL_USER || "admin@example.com",
      first_name: "Administrator",
    };
    await UserModel.create(payload);
    console.log("Đã tạo tài khoản admin mặc định");
  }

  async getMechanics() {
    const mechanics = await UserModel.findAll({
      where: { role: "mechanic" },
      attributes: {
        exclude: ["password", "token_hash", "token_expires_at"],
        include: [
          [
            sequelize.fn(
              "concat",
              sequelize.col("last_name"),
              " ",
              sequelize.col("first_name")
            ),
            "full_name",
          ],
          [
            sequelize.fn(
              "COUNT",
              sequelize.col("HandleTickets.serviceTicket_id")
            ),
            "ticketQueue",
          ],
        ],
      },
      include: [
        {
          model: ServiceTicketModel,
          as: "HandleTickets",
          attributes: [], // avoid selecting non-aggregated columns to satisfy ONLY_FULL_GROUP_BY
          where: {
            status: { [Op.in]: ["confirmed", "inProgress"] },
          },
          required: false, // Để thợ không có phiếu cũng được lấy ra
        },
      ],
      group: ["User.user_id"],
      order: [[sequelize.literal("ticketQueue"), "ASC"]],
    });
    console.log(mechanics);
    return mechanics;
  }
}

module.exports = new StaffService();
