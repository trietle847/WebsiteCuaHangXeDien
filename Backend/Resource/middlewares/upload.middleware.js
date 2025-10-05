const multer = require("multer");
const path = require("path");

// Cấu hình lưu file vào ổ đĩa
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique với timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Middleware multer để parse multipart/form-data
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file image
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

// Middleware xử lý sau khi upload, gắn URL vào req.body
const processUploadedImages = async (req, res, next) => {
  try {
    const imageFiles = req.files?.["images"]; // Lấy array của images

    if (!imageFiles || imageFiles.length === 0) {
      // Nếu không có file, skip
      return next();
    }

    // Tạo URL cho từng file đã upload
    const uploadedImages = imageFiles.map((file) => {
      const imageUrl = `/public/${file.filename}`;
      return {
        imageUrl: imageUrl, // URL để truy cập ảnh
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    });

    // Gắn vào req.body để controller sử dụng
    req.body.uploadedImages = uploadedImages;

    // Xóa req.files để giải phóng bộ nhớ (optional)
    delete req.files;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processUploadedImages };
