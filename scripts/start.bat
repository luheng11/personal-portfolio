@echo off
chcp 65001 >nul
title 卢恒作品集

echo ============================================
echo   卢恒作品集 (Windows)
echo ============================================
echo.

REM Get script directory (project root)
for %%i in ("%~dp0..") do set "ROOT=%%~fi"
cd /d "%ROOT%"
echo [INFO] Project root: %ROOT%
echo.

REM Check node installation
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found, please install Node.js first
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
call node -v
echo.

REM Check frontend dependencies
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Frontend dependency installation failed
        pause
        exit /b 1
    )
)

REM Check backend dependencies
if not exist "api\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd /d "%ROOT%\api"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Backend dependency installation failed
        pause
        exit /b 1
    )
    cd /d "%ROOT%"
)

echo [INFO] Starting backend service (port 3001)...
start "Website API Server" cmd /k "cd /d %ROOT%\api && npm run dev"

echo [INFO] Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo [INFO] Starting frontend service (port 5173)...
start "Website Frontend" cmd /k "cd /d %ROOT% && npm run dev"

echo.
echo ============================================
echo   Services started successfully!
echo ============================================
echo   Backend  API:  http://localhost:3001
echo   Frontend UI:  http://localhost:5173
echo ============================================
echo.
echo Close the two popup windows to stop services
echo Press any key to exit this launcher (services keep running)
pause >nul
