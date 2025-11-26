const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

function authMiddleware(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Chưa có token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res
      .status(403)
      .json({ error: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

const staffRoles = ["mechanic", "store_keeper", "sale_staff", "admin"];
const isValidStaff = (role) => {
  return staffRoles.includes(role);
};

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    let hasRole = false;
    if (allowedRoles.includes("staff")) {
      hasRole = isValidStaff(req.user.role);
    }
    else hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thực hiện thao tác này" });
    }
    next();
  };
}

module.exports = { authMiddleware, authorizeRoles };
