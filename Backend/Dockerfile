# Sử dụng Node.js chính thức
FROM node:18

# Tạo thư mục làm việc
WORKDIR /app

# Copy package trước để cài dependencies
COPY package*.json ./

RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Expose port app chạy
EXPOSE 3000

# Lệnh chạy app
CMD ["npm", "start"]
