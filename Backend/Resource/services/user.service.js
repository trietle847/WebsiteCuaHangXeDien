const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const cartService = require("../services/cart.service");

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
      login_type: "local",
    });

    const defaultRole = await RoleModel.findOne({ where: { name: "user" } });
    if (defaultRole) {
      await user.setRoles([defaultRole]);
    }

    const safeUser = user.toJSON();
    delete safeUser.password;

    // khởi tạo giỏ hàng
    const cart = await cartService.createCart(user.user_id)
    return {
      safeUser,
      cart,
    };
  }

  async login(username, password) {
    const user = await UserModel.findOne({
      where: { username },
      include: [
        {
          model: RoleModel,
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new Error("Sai thông tin đăng nhập");
    }

    const isMacth = await bcrypt.compare(password, user.password);
    if (!isMacth) {
      throw new Error("Sai thông tin đăng nhập");
    }

    const roles = (user.Roles || []).map((r) => r.name);
    const payload = {
      user_id: user.user_id,
      username: user.username,
      roles,
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
      include: [{ model: RoleModel, through: { attributes: [] } }],
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
          login_type: "google",
        });

        const defaultRole = await RoleModel.findOne({
          where: { name: "user" },
        });
        if (defaultRole) {
          await user.setRoles([defaultRole]);
        }

        await FavouriteModel.create({ user_id: user.user_id });
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

  async getAllUsers() {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: RoleModel, through: { attributes: [] } }],
    });
    return users;
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
      include: [{ model: RoleModel, through: { attributes: [] } }],
    });
    return updated;
  }

  async getUserByUsername(username) {
    const user = await UserModel.findOne({
      where: { username: username },
    });

    if (!user) {
      return {
        message: "Người dùng không tồn tại",
      };
    }
    return user;
  }

  async search(keyword="", page=1, limit=15) {
    const offset = (page-1)*limit

    const {count, rows } = await UserModel.findAndCountAll({
      where:{
        [Op.or]: [
          {username: {[Op.like] : `%${keyword}%`}},
          {email: {[Op.like] : `%${keyword}%`}}
        ]
      },
      offset,
      limit
    })
    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    }
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
}

module.exports = new UserService();
