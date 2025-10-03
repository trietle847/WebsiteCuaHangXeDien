const UserModel = require("../models/user.model");
const RoleModel = require("../models/role.model");
const FavouriteModel = require("../models/favourite.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

class UserService {
  async register(userData, roleIds) {
    const existUserName = await UserModel.findOne({
      where: { username: userData.username },
    });

    if (existUserName) {
      throw new Error("Người dùng đã tồn tại");
    }
    else {
      const existEmail = await UserModel.findOne({
        where: {email: userData.email}
      })
      if (existEmail) {
        throw new Error("Email đã được sử dụng")
      }
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    const user = await UserModel.create({
      ...userData,
      password: hashPassword,
    });

    let rolesToAssign = [];
    if (roleIds && roleIds.length > 0) {
      rolesToAssign = await RoleModel.findAll({
        where: { role_id: roleIds },
      });
    } else {
      const defaultRole = await RoleModel.findOne({ where: { name: "user" } });
      if (defaultRole) {
        rolesToAssign = [defaultRole];
      }
    }

    if (rolesToAssign.length > 0) {
      await user.setRoles(rolesToAssign);
    }

    const safeUser = user.toJSON();
    delete safeUser.password;

    // khởi tạo danh sách yêu thích
    const favourite = await FavouriteModel.create({
      user_id: user.user_id
    })
    return {
      safeUser,
      favourite
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
    return { token };
  }

  async getAllUsers() {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: RoleModel, through: { attributes: [] } }],
    });
    return users;
  }

  async updateInfo(userId,data) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("Không tồn tại")
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password,10)
    }

    await user.update(data)

    const updated = await UserModel.findByPk(userId, {
      attributes: {exclude: ["password"]},
      include: [{model: RoleModel, through: {attributes: [] }}]
    })
    return updated
  }

  async getUserByUsername(username) {
    const user = await UserModel.findOne({
      where: { username: username },
    });

    if (!user) {
      return {
        message: "Người dùng không tồn tại"
      }
    }
    return user
  }
}

module.exports = new UserService();
