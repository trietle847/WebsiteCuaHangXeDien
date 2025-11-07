const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const cartService = require("../services/cart.service");
const crypto = require("crypto");
const { sendMail } = require("../utils/mail");
const CartModel = require("../models/cart.model");
require("dotenv").config();
const sequelize = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

class UserService {
  async register(userData) {
    const existUserName = await UserModel.findOne({
      where: { username: userData.username },
    });

    if (existUserName) {
      throw new Error("Người dùng đã tồn tại");
    } else {
      const existEmail = await UserModel.findOne({
        where: { email: userData.email },
      });
      if (existEmail) {
        throw new Error("Email đã được sử dụng");
      }
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    const user = await UserModel.create({
      ...userData,
      password: hashPassword,
      role: "user",
      login_type: "local",
    });

    const safeUser = user.toJSON();
    delete safeUser.password;

    // khởi tạo giỏ hàng
    const cart = await cartService.createCart(user.user_id);
    return {
      safeUser,
      cart,
    };
  }

  async login(username, password) {
    const user = await UserModel.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error("Sai thông tin đăng nhập");
    }

    const isMacth = await bcrypt.compare(password, user.password);
    if (!isMacth) {
      throw new Error("Sai thông tin đăng nhập");
    }

    if (user.status === "banned") {
      throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // const decoded = jwt.decode(token);
    // console.log(decoded);
    return { token };
  }

  async loginByGoogle(googleData) {
    const { google_id, email, first_name, last_name } = googleData;

    let user = await UserModel.findOne({
      where: { google_id: google_id },
    });

    if (!user) {
      user = await UserModel.findOne({
        where: { email },
      });

      if (user) {
        user.google_id = google_id;
        user.login_type = "google";
        await user.save();
      } else {
        user = await UserModel.create({
          google_id,
          email,
          last_name,
          first_name,
          role: "user",
          login_type: "google",
        });

        await CartModel.create({ user_id: user.user_id });
      }
    }

    const roles = (user.Roles || []).map((r) => r.name);

    const payload = {
      user_id: user.user_id,
      username: user.username,
      roles,
    };
    // console.log(payload);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, user };
  }

  // Hàm này là lấy danh sách khách hàng
  async getAllUsers(query) {
    const { keyword = "", page = 1, limit = 10 } = query;
    const validPage = Math.max(parseInt(page) || 1, 1);
    const validLimit = Math.max(parseInt(limit) || 10, 10); // Đảm bảo ít nhất là 10
    const offset = (validPage - 1) * validLimit;
    const { count, rows } = await UserModel.findAndCountAll({
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
        "fullname"
        ]
      ]
      },
      distinct: true,
      where: {
      [Op.and]: [
        { role: "user" },
        {
        [Op.or]: [
          { username: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
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

  async updateInfo(userId, data) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("Không tồn tại");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);

    const updated = await UserModel.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    return updated;
  }

  async getUserByUsername(username) {
    const user = await UserModel.findOne({
      where: { username: username },
      attributes: { exclude: ["password", "token_hash", "token_expires_at"] },
    });

    if (!user) {
      return {
        message: "Người dùng không tồn tại",
      };
    }
    return user;
  }

  async getUserById(id) {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return {
        message: "Người dùng không tồn tại",
      };
    }
    return user;
  }

  async verifyToken(token) {
    if (!token) {
      throw new Error("Token chưa được thiết lập");
    }

    const usersWithToken = await UserModel.findAll({
      where: {
        token_hash: { [Op.ne]: null },
        token_expires_at: { [Op.gt]: Date.now() },
      },
    });

    if (!usersWithToken || usersWithToken.length === 0) {
      throw new Error(
        "Token không hợp lệ hoặc đã hết hạn (không tìm thấy user phù hợp)"
      );
    }

    let foundUser = null;
    for (const user of usersWithToken) {
      // 3. Dùng bcrypt.compare để so sánh token GỐC với hash ĐÃ LƯU
      const isMatch = await bcrypt.compare(token, user.token_hash);
      if (isMatch) {
        foundUser = user;
        break; // Tìm thấy user khớp, thoát vòng lặp
      }
    }

    if (!foundUser) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    return {
      message: "Token hợp lệ",
      user: {
        username: foundUser.username,
        email: foundUser.email,
        first_name: foundUser.first_name,
        last_name: foundUser.last_name,
      },
    };
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error("Token và mật khẩu là bắt buộc");
    }

    // Validate password
    if (newPassword.length < 6) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // Tìm user bằng token
    const usersWithToken = await UserModel.findAll({
      where: {
        token_hash: { [Op.ne]: null },
        token_expires_at: { [Op.gt]: Date.now() },
      },
    });

    let foundUser = null;
    for (const user of usersWithToken) {
      const isMatch = await bcrypt.compare(token, user.token_hash);
      if (isMatch) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    if (foundUser.status === "banned") {
      throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
    }

    // Hash password và kích hoạt tài khoản
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await foundUser.update({
      password: hashedPassword,
      status: "active",
      token_hash: null,
      token_expires_at: null,
    });

    return {
      message:
        "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.",
      username: foundUser.username,
    };
  }

  async activateUser(userId) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    user.status = "active";
    await user.save();
    return {
      message: "Kích hoạt tài khoản thành công",
      user,
    };
  }

  async deactivateUser(userId) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    user.status = "banned";
    await user.save();
    return {
      message: "Vô hiệu hóa tài khoản thành công",
      user,
    };
  }

  async deleteUser(userId) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    await user.destroy();
    return {
      message: "Xóa người dùng thành công",
    };
  }

  async handleResetPasswordRequest(email) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new Error("Không tìm thấy người dùng với email này");
    }
    // Tạo token ngẫu nhiên
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);
    const tokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 giờ

    await user.update({
      token_hash: tokenHash,
      token_expires_at: tokenExpiresAt,
    });
    
    const activationLink = `http://localhost:3001/request?token=${token}`;
    sendMail(
      process.env.EMAIL_USER,
      "[Emotor] Đặt lại mật khẩu",
      `Xin chào ${user.first_name},\n\n` +
        `Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n` +
        `Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:\n` +
        `${activationLink}\n\n` +
        `Link này sẽ hết hạn sau 1 giờ.`
    );
  }
}

module.exports = new UserService();