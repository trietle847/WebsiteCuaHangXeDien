# Hướng dẫn cài đặt
===================================================================

- docker-compose.yml dành cho môi trường phát triển (development)

- docker-compose.prod.yml dành cho môi trường sản xuất (production)

## Cài đặt môi trường phát triển
- Tìm các file .env.example trong thư mục gốc, backend và frontend, sau đó sao chép và đổi tên thành .env tương ứng.
- Điều chỉnh các biến môi trường trong các file .env.
- Trong terminal của thư mục dự án, thực hiện lệnh: docker-compose up -d --build

# Lưu ý
## Về việc cập nhật mã nguồn
Luôn git pull để cập nhật mã nguồn mới nhất.
Resolve các xung đột nếu có.

## Về việc cài đặt package mới
- Khi dev trên container thì nên cài đặt thêm package trong container trước sau đó cài trên host sau.
- Vì cài trên container sẽ đảm bảo các package luôn tương thích tốt với môi trường khác nhau, còn cài trên host để tránh lỗi thiếu package khi chạy lệnh npm start trên host và gợi ý từ IDE.
docker-compose exec backend npm install --> npm install (trên thư mục backend của host)
docker-compose exec frontend npm install --> npm install (trên thư mục frontend của host)

## Về việc sử dụng backend
Nếu có lỗi khi chạy backend thì hãy chuyển sang sử dụng/pull image trietle123/backend-app:latest

## Tài liệu API
http://localhost:3000/api-docs

## Truy cập ứng dụng
http://localhost:3001

## Cài đặt môi trường sản xuất
docker-compose -f docker-compose.prod.yml up -d --build

