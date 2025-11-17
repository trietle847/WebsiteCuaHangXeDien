@echo off
echo ================================
echo   DANG KHOI DONG RASA BOT...
echo ================================

REM ----- Chạy Action Server -----
start cmd /k "call rasaenv\Scripts\activate && rasa run actions"

REM ----- Chạy Rasa Server -----
start cmd /k "call rasaenv\Scripts\activate && rasa run --cors "*" --enable-api"

echo Ca hai server da duoc khoi dong!
pause
