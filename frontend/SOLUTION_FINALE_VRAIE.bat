@echo off
echo ========================================
echo SOLUTION FINALE - "Route not found"
echo ========================================
echo.

echo PROBLEME: "The route auth/login could not be found"
echo.
echo CAUSE: Plusieurs serveurs Laravel sur port 8000 = CONFLITS
echo SOLUTION: UN SEUL serveur sur port 8001
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/8] Arret de TOUS les serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/8] Liberation des ports...
echo (Cette etape peut prendre quelques secondes...)
taskkill /F /IM php.exe 2>nul >nul
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Ports liberes! ✓
echo.

echo [ETAPE 3/8] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 4/8] Verification route...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Route trouvee! ✓
echo.

echo [ETAPE 5/8] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ETAPE 6/8] Construction frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 7/8] Verification...
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [ETAPE 8/8] Demarrage frontend...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy redirige /api vers http://127.0.0.1:8001/api
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js
