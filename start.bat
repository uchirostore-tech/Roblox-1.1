@echo off
title Roblox Pulse V1.1 ^| រ៉ូប្លក ភល្ស V1.1
echo ========================================================
echo   Roblox Pulse V1.1 ^| រ៉ូប្លក ភល្ស V1.1
echo   Spending ^& Account Intelligence
echo ========================================================

cd /d "%~dp0"

:: Check if port 3001 is already active
netstat -ano | findstr /R ":3001 .*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo   [INFO] Server is ALREADY RUNNING on http://localhost:3001!
    echo   Opening your browser now...
    echo.
    start http://localhost:3001
    goto END
)

:: Start server and open browser
echo   Starting local server on http://localhost:3001 ...
echo   Opening browser in 2 seconds...
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3001"
node server/index.js

:END
pause
