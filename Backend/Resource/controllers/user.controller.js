const UserService = require("../services/user.service");
const ApiError = require("../middlewares/error.middleware");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    res.send({
      message: "Danh sách người dùng",
      data: users
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy dữ liệu người dùng ${error}`));
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await UserService.register(req.body);
    res.send({
      message: "Đăng ký tài khoản thành công",
      data: user
    });
  } catch (error) {
    return next(new ApiError(500, `${error.message}`));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const response = await UserService.login(username, password);
    res.json({
      message: "Đăng nhập thành công",
      data: response
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi đăng nhập ${error.message}`));
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const updated = await UserService.updateInfo(userId, req.body);
    res.send({
      message: "Cập nhật thông tin người dùng thành công",
      data: updated,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi cập nhật ${error}`));
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const username = req.user.username;
    const response = await UserService.getUserByUsername(username);

    res.send({
      message: "Thông tin người dùng",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy người dùng ${error}`));
  }
};
