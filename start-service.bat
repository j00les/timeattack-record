@echo off
cd /d D:\Repos\timeattack-record

:: Start the Node.js service
start node server.js

:: Wait for the server to start (adjust time as needed)
timeout /t 5 /nobreak >nul

:: Path to Chrome executable
set "chromePath=C:\Program Files\Google\Chrome\Application\chrome.exe"

:: Open the HTML files in Chrome
start "" "%chromePath%" "D:\Repos\timeattack-record\open-input.html"
start "" "%chromePath%" "D:\Repos\timeattack-record\open-leaderboard.html"
