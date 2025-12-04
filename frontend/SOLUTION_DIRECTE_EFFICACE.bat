@echo off
echo ========================================
echo SOLUTION DIRECTE ET EFFICACE
echo ========================================
echo.

echo Cette solution va tester DIRECTEMENT la route.
echo.

cd backend-laravel

echo [1/5] Arret de tous les serveurs...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/5] Nettoyage COMPLET...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
if exist bootstrap\cache\config.php del /Q bootstrap\cache\config.php 2>nul
echo Cache nettoye! ✓
echo.

echo [3/5] Test DIRECT de la route avec PHP...
php -r "require 'vendor/autoload.php'; \$app = require_once 'bootstrap/app.php'; \$request = Illuminate\Http\Request::create('/api/auth/login', 'POST'); try { \$response = \$app->handle(\$request); echo 'Route existe! Status: ' . \$response->getStatusCode() . PHP_EOL; } catch (Exception \$e) { echo 'Erreur: ' . \$e->getMessage() . PHP_EOL; }"
echo.

echo [4/5] Liste de TOUTES les routes API...
php artisan route:list --path=api
echo.

echo [5/5] Demarrage du serveur et test...
start "Backend Laravel" cmd /k "cd /d %CD% && php artisan serve"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo TESTEZ MAINTENANT
echo ========================================
echo.
echo 1. Ouvrez votre navigateur
echo 2. Allez a: http://localhost:8000/api/auth/login
echo 3. Dites-moi ce que vous voyez
echo.
echo Si vous voyez toujours "route not found", 
echo copiez TOUT le message d'erreur et envoyez-le moi.
echo.
pause


