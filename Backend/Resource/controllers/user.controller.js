const UserService = require("../services/user.service");
const ApiError = require("../middlewares/error.middleware");
const userService = require("../services/user.service");
const staffService = require("../services/staff.service");

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    res.send({
      message: "Danh sách người dùng",
      ...result,
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
      data: user,
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
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi đăng nhập ${error.message}`));
  }
};

exports.loginGoogleCallback = async (req, res, next) => {
  try {
    const profile = req.user;
    // console.log("controller");
    // console.log(req.user);
    const response = await UserService.loginByGoogle({
      google_id: profile.google_id,
      email: profile.emails?.[0]?.value,
      first_name: profile.name?.givenName,
      last_name: profile.name?.familyName,
    });
    // res.json({
    //   data: response,
    // });

    // console.log(response.token);
    // sessionStorage.getItem("token", response.token)

    res.redirect(`http://localhost:3001/login/success?token=${response.token}`)
  } catch (error) {
    return next(new ApiError(500, `Lỗi đăng nhập Google ${error}`));
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

exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await UserService.getUserById(id);

    res.send({
      message: "Thông tin người dùng",
      data: response,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi lấy người dùng ${error}`));
  }
};

exports.getAllStaff = async (req, res, next) => {
  try {
    const result = await staffService.getAllStaff(req.query);
    res.send({
      message: "Danh sách nhân viên",
      ...result
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi lấy danh sách nhân viên ${error.message}`));
  }
};

exports.createStaff = async (req, res, next) => {
  try {
    const userData = req.body;
    const response = await staffService.createStaff(userData);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi tạo nhân viên ${error.message}`));
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    const response = await userService.verifyToken(token);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi xác thực token ${error.message}`));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const response = await userService.resetPassword(token, newPassword);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi đặt lại mật khẩu ${error.message}`));
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await userService.activateUser(id);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi kích hoạt người dùng ${error.message}`));
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await userService.deactivateUser(id);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi vô hiệu hóa người dùng ${error.message}`));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await userService.deleteUser(id);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi xóa người dùng ${error.message}`));
  }
};

exports.handleResetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await userService.handleResetPasswordRequest(email);
    res.send(response);
  } catch (error) {
    return next(new ApiError(500, `Lỗi xử lý yêu cầu đặt lại mật khẩu ${error.message}`));
  }
};