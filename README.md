# Hướng dẫn cài đặt
===================================================================

docker-compose.yml dành cho môi trường phát triển (development)
docker-compose.prod.yml dành cho môi trường sản xuất (production)

## Cài đặt môi trường phát triển
Tìm các file .env.example trong thư mục gốc, backend và frontend, sau đó sao chép và đổi tên thành .env tương ứng.
Điều chỉnh các biến môi trường trong các file .env.
docker-compose up -d --build

## Lưu ý
Luôn git pull để cập nhật mã nguồn mới nhất.
Resolve các xung đột nếu có.
Chạy lệnh trong container để cài đặt các gói mới nếu có thay đổi trong package.json:
docker-compose exec backend npm install
docker-compose exec frontend npm install

## Tài liệu API
http://localhost:3000/api-docs

## Truy cập ứng dụng
http://localhost:3001

## Cài đặt môi trường sản xuất
docker-compose -f docker-compose.prod.yml up -d --build

