# Sử dụng Node.js chính thức
FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Copy package trước để cài dependencies
COPY package*.json ./

RUN npm install

# Mở cổng mà ứng dụng của bạn đang lắng nghe.
EXPOSE 3000

# Lệnh cuối cùng để chạy ứng dụng khi container khởi động.
# Ở đây là lệnh khởi chạy server của bạn.
CMD ["npm","start"]
