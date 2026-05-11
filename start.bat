@echo off
title RT ELECTRONICS
cd /d "%~dp0"

echo.
echo [96m╔══════════════════════════════════════════╗[0m
echo [96m║     RT ELECTRONICS - DEPLOYMENT MODE    ║[0m
echo [96m╚══════════════════════════════════════════╝[0m
echo.

if not exist "dist\index.html" (
    echo [93m[BUILD] Building frontend...[0m
    call npx vite build
    if %errorlevel% neq 0 (
        echo [91m[ERROR] Build failed. Installing dependencies...[0m
        call npm install
        call npx vite build
    )
    echo [92m[BUILD] Complete[0m
) else (
    echo [92m[OK] Frontend build found[0m
)

echo [93m[START] Launching server on port 3001...[0m
echo.
echo [92m  Site:   http://localhost:3001[0m
echo [92m  Admin:  http://localhost:3001/admin[0m
echo [92m  Login:  admin@rtelectronics.com / admin123[0m
echo.
node server/server.js

pause
