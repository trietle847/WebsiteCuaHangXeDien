FROM node:20-alpine

# Thiết lập thư mục làm việc bên trong container.
# Tất cả các lệnh tiếp theo sẽ chạy trong thư mục này.
WORKDIR /app

# Sao chép các file metadata quan trọng trước.
# Bước này giúp Docker tận dụng bộ nhớ cache để build nhanh hơn.
COPY package*.json ./

# Cài đặt tất cả các dependencies của dự án.
RUN npm install

# Mở cổng mà ứng dụng của bạn đang lắng nghe.
EXPOSE 3000

# Lệnh cuối cùng để chạy ứng dụng khi container khởi động.
# Ở đây là lệnh khởi chạy server của bạn.
CMD ["npm","start"]