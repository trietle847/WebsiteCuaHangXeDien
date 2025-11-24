const ratingService = require("../services/rating.service");

const ratingController = {
  async create(req, res) {
    try {
      const user_id = req.user.user_id;
      const product_id = req.params.id;
      const { stars, content } = req.body;
      console.log("Received rating data:", {
        user_id,
        product_id,
        stars,
        content,
      });
      if (!user_id || !product_id || !stars)
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

      const rating = await ratingService.create({
        user_id,
        product_id,
        stars,
        content,
      });

      return res.status(201).json({
        message: "Tạo đánh giá thành công",
        data: rating,
      });
    } catch (error) {
      console.error("Lỗi tạo rating:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  async getAll(req, res) {
    try {
      const ratings = await ratingService.getAll(req.query);

      return res.status(200).json({
        message: "Lấy danh sách rating thành công",
        data: ratings, // ✅ gửi trực tiếp object, không gọi res.json() nữa
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách rating:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
  async checkPurchased(req, res) {
    try {
      const user_id = req.user.user_id;
      const product_id = req.params.productId;

      const order = await ratingService.getPurchasedOrderItem(
        user_id,
        product_id
      );

      if (order) {
        return res.json({
          message: "Người dùng đã mua sản phẩm này",
          data: true,
        });
      } else {
        return res.json({
          message: "Người dùng chưa mua sản phẩm này",
          data: false,
        });
      }
    } catch (error) {
      console.error("Lỗi kiểm tra mua sản phẩm:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  async getMyRating(req, res) {
    try {
      const user_id = req.user.user_id;
      const product_id = req.params.productId;
      const rating = await ratingService.getMyRating(user_id, product_id);
      if (rating) {
        return res.json({
          message: "Lấy đánh giá của người dùng thành công",
          data: rating,
        });
      } else {
        return res.json({
          message:
            "Người dùng chưa mua sản phẩm này hoặc chưa đánh giá sản phẩm",
        });
      }
    } catch (error) {
      console.error("Lỗi lấy đánh giá sản phẩm người dùng:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;

      if (!id) {
        return res.status(400).json({ message: "Thiếu ID đánh giá" });
      }

      const updatedRating = await ratingService.update(id, data);

      if (!updatedRating) {
        return res.status(404).json({ message: "Không tìm thấy đánh giá" });
      }

      return res.status(200).json({
        message: "Cập nhật đánh giá thành công",
        data: updatedRating,
      });
    } catch (error) {
      console.error("Lỗi cập nhật rating:", error);
      return res.status(500).json({ message: error.message || "Lỗi server" });
    }
  },
};

module.exports = ratingController;
