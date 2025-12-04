@echo off
echo ========================================
echo SOLUTION - Utiliser un port different
echo ========================================
echo.

echo Les processus sur le port 8000 sont persistants.
echo Solution: Demarrer Laravel sur le port 8001.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/3] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
cd ..
echo Cache nettoye! ✓
echo.

echo [2/3] Demarrage Laravel sur le port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur demarre sur port 8001! ✓
echo.

echo [3/3] Modification du proxy pour utiliser le port 8001...
echo.
echo Le proxy doit maintenant pointer vers http://localhost:8001
echo.

cd ..

echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo Le serveur Laravel tourne maintenant sur le port 8001.
echo.
echo Vous devez modifier serve-with-proxy.js pour utiliser le port 8001.
echo OU utilisez la variable d'environnement:
echo.
echo   set LARAVEL_URL=http://localhost:8001
echo   node serve-with-proxy.js
echo.
echo Testez: http://localhost:8001/api/auth/login
echo.
pause


