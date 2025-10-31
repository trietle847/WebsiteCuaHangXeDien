@echo off
call .\rasaenv\Scripts\activate
cd /d C:\Users\ADMIN\BotRasa
rasa run --enable-api --cors "*" --debug
pause
