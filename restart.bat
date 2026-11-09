@echo off
title Restart Roblox Rewind Server
echo ========================================================
echo   Restarting Roblox Rewind Server
echo ========================================================

echo Stopping any running instance on port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /R ":3001 .*LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo Starting fresh server...
start start.bat
