@echo off
setlocal
title Smart Pet Care Application

:: Define the application name and directory
set "APP_NAME=Smart Pet Care"
set "PORT=8000"

echo ======================================================
echo   Starting %APP_NAME%...
echo ======================================================
echo.

:: 1. Check if PHP is available
where php >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PHP is not found in your system PATH.
    echo Please install PHP and add it to your PATH.
    pause
    exit /b
)

:: 2. Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js and add it to your PATH.
    pause
    exit /b
)

:: 3. Start Laravel Server in the background
echo [+] Starting Backend Server...
start /min cmd /c "php artisan serve --port=%PORT%"

:: 4. Start Vite (Frontend) Server in the background
echo [+] Starting Frontend Assets...
start /min cmd /c "npm run dev"

:: 5. Wait for servers to wake up
echo.
echo Waiting for backend server to start on port %PORT%...

:check_port
netstat -ano | find "LISTENING" | find ":%PORT%" >nul
if %errorlevel% neq 0 (
    timeout /t 1 /nobreak > nul
    goto check_port
)

echo Backend is up... Waiting a few seconds for frontend Vite server...
timeout /t 3 /nobreak > nul

:: 6. Open the application in the default browser
echo.
echo [+] Opening %APP_NAME% in browser...
start http://localhost:%PORT%

echo.
echo ======================================================
echo   %APP_NAME% IS NOW RUNNING
echo ======================================================
echo.
echo   - Backend: http://127.0.0.1:%PORT%
echo   - Frontend: Running via Vite
echo.
echo   * To STOP the application:
echo     Close this window and end 'php.exe' and 'node.exe' 
echo     in Task Manager if they continue to run.
echo ======================================================
echo.
pause
exit
