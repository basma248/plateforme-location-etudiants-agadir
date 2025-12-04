@echo off
echo ========================================
echo FIX DEFINITIF - Route auth/login
echo ========================================
echo.

echo VOTRE CODE N'EST PAS SUPPRIME!
echo Tous vos fichiers sont intacts.
echo.

echo [1/6] Verification de PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: PHP n'est pas installe!
    echo Installez PHP ou utilisez XAMPP.
    pause
    exit /b 1
)

echo PHP trouve! ✓
echo.

cd backend-laravel

echo [2/6] Verification du controle AuthController...
if exist app\Http\Controllers\AuthController.php (
    echo AuthController existe. ✓
) else (
    echo ERREUR: AuthController n'existe pas!
    pause
    exit /b 1
)

echo.
echo [3/6] Nettoyage COMPLET du cache Laravel...
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye. ✓
echo.

echo [4/6] Verification des routes...
php artisan route:list --path=api/auth
echo.

echo [5/6] Test de la route directement...
echo Test avec curl...
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" 2>nul || echo curl non disponible
echo.

echo [6/6] Instructions...
echo.
echo Si la route n'est toujours pas trouvee:
echo   1. Redemarrez le serveur Laravel (Ctrl+C puis php artisan serve)
echo   2. Verifiez que le serveur ecoute sur http://localhost:8000
echo   3. Testez: http://localhost:8000/api/auth/login
echo.

pause


