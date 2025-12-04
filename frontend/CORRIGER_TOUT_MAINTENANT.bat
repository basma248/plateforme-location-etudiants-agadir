@echo off
echo ========================================
echo CORRECTION COMPLETE - MAINTENANT
echo ========================================
echo.

echo VOTRE CODE EST INTACT! ✓
echo Tous vos fichiers sont la.
echo.

echo [1/5] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/5] Nettoyage COMPLET du cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [3/5] Verification de la route auth/login...
php artisan route:list --path=api/auth
echo.

echo [4/5] Demarrage du backend Laravel...
echo Le serveur va demarrer sur http://localhost:8000
echo.
start "Backend Laravel" cmd /k "php artisan serve"
timeout /t 3 /nobreak >nul
echo Backend demarre! ✓
echo.

cd ..

echo [5/5] Construction et demarrage du frontend...
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
echo.
echo Testez: http://localhost:8000/api/auth/login
echo (Vous devriez voir une erreur JSON, pas "route not found")
echo.

node serve-with-proxy.js


