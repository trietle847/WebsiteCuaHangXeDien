# 1. Dùng bản FULL để có sẵn Torch, Transformers, Spacy, Sklearn
FROM rasa/rasa:3.6.21-full

USER root

WORKDIR /app

# 2. Cài đặt các thư viện hệ thống nếu cần (ví dụ git)
# RUN apt-get update && apt-get install -y git

# 3. Copy requirements trước
COPY requirements.txt .

# 4. KỸ THUẬT TĂNG TỐC PIP:
# - Dùng --mount=type=cache để lưu cache pip vào máy host (tránh down lại)
# - Dùng --default-timeout để tránh lỗi mạng chập chờn
# - Chỉ cài những thứ thật sự thiếu
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --default-timeout=100 --no-cache-dir -r requirements.txt

# 5. Nếu bạn dùng Spacy và cần model ngôn ngữ riêng (ví dụ tiếng Anh hay tiếng Việt)
# Hãy chạy lệnh download model ở đây. Nếu dùng spacy-sklearn mặc định thì bỏ qua.
# RUN python -m spacy download en_core_web_md

# 6. Bây giờ mới copy code (để tận dụng cache của bước 4 khi sửa code)
COPY . .

USER 1001

# 7. Train model
RUN rasa train

EXPOSE 5005