@echo off
echo ========================================
echo DEMARRER AVEC PORT 8001
echo ========================================
echo.

echo Solution: Utiliser le port 8001 pour Laravel
echo pour eviter les conflits avec les serveurs sur 8000.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/4] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
cd ..
echo Cache nettoye! ✓
echo.

echo [2/4] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur demarre sur port 8001! ✓
echo.

echo [3/4] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [4/4] Demarrage du frontend avec proxy vers port 8001...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8001 (PORT DIFFERENT!)
echo.
echo Le proxy pointe maintenant vers le port 8001.
echo.
echo TESTEZ MAINTENANT:
echo   1. Allez a: http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. La connexion devrait fonctionner!
echo.

node serve-with-proxy-8001.js


