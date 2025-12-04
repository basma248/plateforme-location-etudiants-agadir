@echo off
echo ========================================
echo ANALYSE COMPLETE DU PROBLEME
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/10] Verification de la route dans le code...
cd backend-laravel
findstr /C:"auth/login" routes\api.php
if %errorlevel% equ 0 (
    echo Route trouvee dans api.php! ✓
) else (
    echo Route NON trouvee dans api.php! ❌
)
echo.

echo [2/10] Liste des routes Laravel enregistrees...
php artisan route:list --path=api/auth 2>&1
echo.

echo [3/10] Verification du controle AuthController...
if exist app\Http\Controllers\AuthController.php (
    echo AuthController existe! ✓
) else (
    echo AuthController n'existe PAS! ❌
)
echo.

echo [4/10] Verification des serveurs Laravel...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Serveur Laravel tourne! ✓
) else (
    echo Serveur Laravel ne tourne PAS! ❌
)
echo.

echo [5/10] Nettoyage cache Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [6/10] Test direct de la route avec PHP...
php -r "require 'vendor/autoload.php'; \$app = require_once 'bootstrap/app.php'; \$request = Illuminate\Http\Request::create('/api/auth/login', 'POST', ['email' => 'test@test.com', 'password' => 'test']); try { \$response = \$app->handle(\$request); echo 'Route accessible! Status: ' . \$response->getStatusCode() . PHP_EOL; } catch (Exception \$e) { echo 'Erreur: ' . \$e->getMessage() . PHP_EOL; }" 2>&1
echo.

cd ..

echo [7/10] Verification du proxy serve-with-proxy.js...
if exist serve-with-proxy.js (
    echo serve-with-proxy.js existe! ✓
    findstr /C:"/api" serve-with-proxy.js
) else (
    echo serve-with-proxy.js n'existe PAS! ❌
)
echo.

echo [8/10] Verification de l URL API dans authService.js...
findstr /C:"API_BASE_URL" src\services\authService.js
findstr /C:"/auth/login" src\services\authService.js
echo.

echo [9/10] Verification des ports...
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8000"
echo.

echo [10/10] Resume...
echo.
echo ========================================
echo DIAGNOSTIC TERMINE
echo ========================================
echo.
echo Analysez les resultats ci-dessus pour trouver le probleme.
echo.
pause


