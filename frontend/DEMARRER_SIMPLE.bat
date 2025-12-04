@echo off
echo ========================================
echo DEMARRAGE SIMPLE
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/4] Arret rapide des serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [2/4] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [3/4] Verification du build...
if not exist build\index.html (
    echo Build n'existe pas. Construction...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERREUR lors de la construction.
        pause
        exit /b %errorlevel%
    )
    echo Build termine! ✓
) else (
    echo Build existe deja. ✓
)
echo.

echo [4/4] Demarrage frontend...
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


