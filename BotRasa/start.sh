#!/bin/bash

# Lấy toàn bộ lệnh được truyền vào
CMD="$@"

# Kiểm tra: Nếu lệnh có chứa chữ "actions", nghĩa là đây là Action Server
# Action Server thì KHÔNG CẦN train model
if [[ "$CMD" == *"actions"* ]]; then
    echo "🚀 Khởi động Action Server..."
else
    # Đây là Rasa Server chính
    # Kiểm tra xem có model chưa, nếu chưa thì train
    if [ -z "$(ls -A models/*.tar.gz 2>/dev/null)" ]; then
        echo "🤖 Không tìm thấy model. Đang tự động train lần đầu..."
        rasa train
    else
        echo "✅ Đã tìm thấy model."
    fi
fi

# Kỹ thuật sửa lỗi "exec: run: not found":
# Nếu lệnh bắt đầu bằng "run", tự động thêm "rasa" vào đằng trước
if [[ "$1" == "run" ]]; then
    exec rasa "$@"
else
    exec "$@"
fi