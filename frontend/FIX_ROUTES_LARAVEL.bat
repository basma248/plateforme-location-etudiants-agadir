@echo off
echo ========================================
echo FIX ROUTES LARAVEL - Cache et Routes
echo ========================================
echo.

echo [1/4] Verification de PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: PHP n'est pas installe!
    pause
    exit /b 1
)

echo PHP trouve!
echo.

cd backend-laravel

echo [2/4] Nettoyage du cache Laravel...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo Cache nettoye.
echo.

echo [3/4] Liste des routes API auth...
php artisan route:list --path=api/auth
echo.

echo [4/4] Test de la route /api/auth/login...
echo.
echo Si vous voyez "POST api/auth/login" ci-dessus, la route existe!
echo.
echo Testez maintenant dans votre navigateur:
echo   http://localhost:8000/api/auth/login
echo.
echo Ou testez avec le frontend.
echo.

pause


