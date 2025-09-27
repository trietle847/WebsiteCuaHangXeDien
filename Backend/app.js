const express = require("express");
const cors = require("cors");
const ApiError = require("./Resource/middlewares/error.middleware");
const { swaggerUi, swaggerSpec } = require("./Resource/utils/swagger");

const productRoute = require("./Resource/routes/product.route");
const userRoute = require("./Resource/routes/user.route");
const imageRoute = require("./Resource/routes/image.route");
const promotionRoute = require("./Resource/routes/promotion.route");
const maintenanceRoute = require("./Resource/routes/maintenance.route");
const favouriteRoute = require("./Resource/routes/favourite.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/image", imageRoute);
app.use("/promotion", promotionRoute);
app.use("/maintenance", maintenanceRoute);
app.use("/favourite", favouriteRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
