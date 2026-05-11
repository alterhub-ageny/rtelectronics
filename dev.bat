@echo off
title RT ELECTRONICS (Dev Mode)
cd /d "%~dp0"

echo.
echo [96m╔══════════════════════════════════════════╗[0m
echo [96m║     RT ELECTRONICS - DEVELOPMENT MODE   ║[0m
echo [96m╚══════════════════════════════════════════╝[0m
echo.
echo [92m  API:  http://localhost:3001[0m
echo [92m  Site: http://localhost:5173[0m
echo [92m  Admin: admin@rtelectronics.com / admin123[0m
echo.

call npm run dev
pause
