@echo off
echo ======================================================================
echo   TRADITIONAL TELUGU KNOWLEDGE & PDF READER APPLICATION
echo ======================================================================
echo.

echo [1/3] Starting PHP 8.2 REST API on http://127.0.0.1:8000 ...
start "Telugu Knowledge PHP API" cmd /k "php -S 127.0.0.1:8000 -t backend/public"

echo [2/3] Starting Web Administration Dashboard on http://127.0.0.1:3000 ...
start "Telugu Knowledge Admin Console" cmd /k "cd admin && npm run dev -- --port 3000"

echo [3/3] Starting React Native Expo Mobile App ...
start "Telugu Knowledge Mobile App" cmd /k "cd mobile && npx expo start"

echo.
echo All services launched!
echo - API Backend: http://127.0.0.1:8000/api/health
echo - Admin Console: http://127.0.0.1:3000 (User: admin@vedicknowledge.org / admin123)
echo - Mobile Metro: Follow terminal instructions to scan QR code in Expo Go
echo ======================================================================
pause
