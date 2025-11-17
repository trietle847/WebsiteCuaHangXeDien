@echo off
call rasaenv\Scripts\activate
echo === Running Rasa Action Server ===
rasa run actions
pause
