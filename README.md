# Website Cửa Hàng Xe Điện

Hệ thống quản lý cửa hàng xe điện với Backend (Node.js), Frontend (React + Vite), và Chatbot Rasa.

## Yêu cầu hệ thống

- **Docker** và **Docker Compose** đã cài đặt
- **Git**
- **MySQL** (hoặc sử dụng MySQL container trong Docker)

## Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/trietle847/WebsiteCuaHangXeDien.git
cd WebsiteCuaHangXeDien
```

### 2. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
DB_PORT=3306
DB_PASSWORD=your_mysql_password
DB_NAME=cua_hang_xe_dien
```

### 3. Khởi chạy ứng dụng

Sử dụng Docker Compose để build và chạy toàn bộ hệ thống:

```bash
docker compose up -d --build
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

### 5. Dừng ứng dụng

```bash
docker compose down
```

## Cấu trúc dự án

```
├── Backend/          # Node.js + Express API
├── Frontend/         # React + Vite + TypeScript
├── BotRasa/          # Rasa Chatbot
├── docker-compose.yml
└── .env
```

## Lưu ý

- Lần đầu chạy có thể mất vài phút để build images
- Database sẽ tự động tạo bảng khi Backend khởi động
- Để xem logs: `docker compose logs -f`
- Để rebuild sau khi thay đổi code: `docker compose up -d --build`
