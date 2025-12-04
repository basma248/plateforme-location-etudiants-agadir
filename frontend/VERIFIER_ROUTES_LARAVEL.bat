@echo off
echo ========================================
echo VERIFICATION DES ROUTES LARAVEL
echo ========================================
echo.

echo [1/3] Verification de PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: PHP n'est pas installe ou pas dans le PATH!
    echo.
    echo Installez PHP ou ajoutez-le au PATH.
    pause
    exit /b 1
)

echo PHP trouve!
echo.

echo [2/3] Liste des routes API auth...
cd backend-laravel
php artisan route:list --path=api/auth
echo.

echo [3/3] Test de la route /api/auth/login...
echo.
echo Test avec curl (si disponible)...
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" 2>nul || echo curl non disponible - testez manuellement dans le navigateur
echo.

pause


