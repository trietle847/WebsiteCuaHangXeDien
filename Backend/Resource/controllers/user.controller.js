const UserService = require("../services/user.service");
const ApiError = require("../middlewares/error.middleware");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers();
    return res.send(users);
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy dữ liệu người dùng ${error}`));
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await UserService.register(req.body);
    // console.log(user);
    return res.send(user);
  } catch (error) {
    return next(new ApiError(500, `Lỗi tạo người dùng ${error}`));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const response = await UserService.login(username, password);
    res.json(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi đăng nhập ${error}`));
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.user.user_id

    const updated = await UserService.updateInfo(userId,req.body)
    res.send({
      message: "cập nhật thành công",
      user: updated
    })
  } catch (error) {
    return next(new ApiError(500, `Lỗi cập nhật ${error}`));
  }
}
