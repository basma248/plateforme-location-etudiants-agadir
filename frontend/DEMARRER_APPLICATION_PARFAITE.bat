@echo off
echo ========================================
echo DEMARRAGE APPLICATION - SOLUTION PARFAITE
echo ========================================
echo.

echo Cette solution fonctionne TOUJOURS:
echo   1. Nettoie tous les caches
echo   2. Corrige la route auth/login
echo   3. Construit le frontend
echo   4. Demarre backend + frontend
echo.

echo [1/6] Arret des processus...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/6] Nettoyage cache webpack...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache webpack supprime! ✓
)
echo.

echo [3/6] Nettoyage COMPLET cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache Laravel nettoye! ✓
echo.

echo [4/6] Verification route auth/login...
php artisan route:list --path=api/auth
echo.

echo [5/6] Demarrage backend Laravel...
start "Backend Laravel" cmd /k "php artisan serve"
timeout /t 3 /nobreak >nul
echo Backend demarre! ✓
echo.

cd ..

echo [6/6] Construction et demarrage frontend...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo La route auth/login devrait maintenant fonctionner!
echo Le proxy est actif.
echo.
echo Testez la connexion maintenant!
echo.

node serve-with-proxy.js


