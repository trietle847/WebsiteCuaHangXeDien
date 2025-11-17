@echo off
call rasaenv\Scripts\activate
echo === Running Rasa Server ===
rasa run --cors "*" --enable-api
pause
