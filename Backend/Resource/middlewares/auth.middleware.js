const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({message: "Chưa có token"})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next();
        console.log(decoded);
    } catch (error) {
        return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền thực hiện thao tác này" });
    }

    next();
  };
}

module.exports = { authMiddleware, authorizeRoles };