@echo off
title 🚀 Khoi dong Chatbot Rasa (Emotor)
echo ==========================================
echo   Dang khoi dong Chatbot Rasa (Emotor)...
echo ==========================================

:: Chuyển vào thư mục dự án
cd /d C:\Users\ADMIN\BotRasa

:: Sử dụng backend PyTorch (nếu có Transformers)
set TRANSFORMERS_BACKEND=pt

:: Cửa sổ 1: Rasa server (API + CORS)
start cmd /k "call C:\Users\ADMIN\rasaenv\Scripts\activate.bat && cd /d C:\Users\ADMIN\BotRasa && rasa run --enable-api --cors '*' --debug"

:: Cửa sổ 2: Action server
start cmd /k "call C:\Users\ADMIN\rasaenv\Scripts\activate.bat && cd /d C:\Users\ADMIN\BotRasa && rasa run actions"

:: Cửa sổ 3: Giao diện HTML
start "" "C:\Users\ADMIN\BotRasa\chatbot.html"

echo.
echo 🚀 Tat ca da khoi dong thanh cong! Co the dung chatbot duoc roi.
pause
