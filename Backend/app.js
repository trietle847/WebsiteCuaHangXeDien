const express = require("express");
const cors = require("cors");
// const ApiError = require("./Resource/middlewares/error.middleware");

// const productRoute = require("./Resource/routes/product.route");
// const userRoute = require("./Resource/routes/user.route");
const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/product", productRoute);
// app.use("/user", userRoute);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 5000).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
