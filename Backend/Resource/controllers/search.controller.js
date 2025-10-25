const UserService = require("../services/user.service");
const ProductService = require("../services/product.service");
const PromotionService = require("../services/promotion.service");
const ApiError = require("../middlewares/error.middleware");

const services = {
  user: UserService,
  product: ProductService,
  promotion: PromotionService,
};

exports.search = async (req, res, next) => {
  const { entity } = req.params;
  const { keyword = "", page = 1, limit = 10 } = req.query;

  const service = services[entity];
  if (!service) {
    return res.status(400).json({ mesage: "Entity k hợp lệ !" });
  }

  const validPage = Math.max(parseInt(page) || 1, 1);
  const validLimit = Math.max(Math.max(parseInt(limit) || 10, 1), 100);

  try {
    const response = await service.search(keyword, validPage, validLimit);

    res.send({
      message: "Kết quả tìm kiếm",
      data: response,
    });
  } catch (error) {
    new ApiError(500, `Lỗi khi đăng ký sửa xe ${error}`);
  }
};
