@echo off
echo ========================================
echo SOLUTION ROBUSTE - Sans blocage
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/6] Arret rapide des serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/6] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 3/6] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ETAPE 4/6] Construction frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 5/6] Verification...
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [ETAPE 6/6] Demarrage frontend...
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


