FROM rasa/rasa:3.6.21-full

USER root
WORKDIR /app

# Copy script vào trước
COPY start.sh /app/start.sh
# Cấp quyền thực thi cho script (quan trọng)
RUN chmod +x /app/start.sh

COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --default-timeout=100 --no-cache-dir -r requirements.txt

COPY . .
USER 1001

# KHÔNG train ở đây nữa (vì volume sẽ che mất)
# RUN rasa train  <-- XÓA HOẶC COMMENT DÒNG NÀY

# Thiết lập Entrypoint là file script vừa tạo
ENTRYPOINT ["/app/start.sh"]

# CMD mặc định (nếu docker-compose không ghi đè)
CMD ["rasa", "run", "--enable-api", "--cors", "*", "--debug"]