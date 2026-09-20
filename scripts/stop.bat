@echo off
chcp 65001 >nul
title 停止作品集服务

echo ============================================
echo   停止作品集服务 (Windows)
echo ============================================
echo.

echo [INFO] Stopping frontend service (port 5173)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /pid %%a /f >nul 2>&1
    echo [OK] Killed process PID: %%a
)

echo [INFO] Stopping backend service (port 3001)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /pid %%a /f >nul 2>&1
    echo [OK] Killed process PID: %%a
)

echo.
echo ============================================
echo   All services stopped
echo ============================================
echo.
pause
