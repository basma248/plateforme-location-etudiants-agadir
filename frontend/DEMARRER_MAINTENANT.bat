@echo off
echo ========================================
echo DEMARRAGE IMMEDIAT
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/3] Arret rapide des serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [2/3] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [3/3] Demarrage frontend...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo TESTEZ: http://localhost:3000
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js


