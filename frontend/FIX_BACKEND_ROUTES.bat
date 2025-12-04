@echo off
echo ========================================
echo FIX BACKEND LARAVEL - Routes API
echo ========================================
echo.

echo [1/5] Verification de PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: PHP n'est pas installe ou pas dans le PATH!
    echo.
    echo Installez PHP ou ajoutez-le au PATH.
    echo Ou utilisez XAMPP qui inclut PHP.
    pause
    exit /b 1
)

echo PHP trouve!
echo.

cd backend-laravel

echo [2/5] Nettoyage complet du cache Laravel...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye.
echo.

echo [3/5] Verification du controle AuthController...
if exist app\Http\Controllers\AuthController.php (
    echo AuthController existe. ✓
) else (
    echo ERREUR: AuthController n'existe pas!
    pause
    exit /b 1
)

echo.
echo [4/5] Liste des routes API auth...
php artisan route:list --path=api/auth
echo.

echo [5/5] Test de la route...
echo.
echo Si vous voyez "POST api/auth/login" ci-dessus, la route existe!
echo.
echo Testez maintenant:
echo   1. Ouvrez http://localhost:8000/api/auth/login dans votre navigateur
echo   2. Vous devriez voir une erreur de validation (normal, pas de donnees)
echo   3. Si vous voyez "route not found", il y a un probleme
echo.

pause


