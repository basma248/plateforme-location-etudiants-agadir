@echo off
echo ========================================
echo CORRECTION ROUTE auth/login - FINAL
echo ========================================
echo.

echo [1/7] Arret de tous les serveurs Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Serveurs arretes.
echo.

cd backend-laravel

echo [2/7] Verification de la route dans le code...
findstr /C:"auth/login" routes\api.php
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee dans api.php!
    pause
    exit /b 1
) else (
    echo Route trouvee dans api.php! ✓
)
echo.

echo [3/7] Verification du controle AuthController...
if exist app\Http\Controllers\AuthController.php (
    echo AuthController existe! ✓
) else (
    echo ERREUR: AuthController n'existe pas!
    pause
    exit /b 1
)
echo.

echo [4/7] Nettoyage COMPLET de tous les caches Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [5/7] Recuperation des routes...
php artisan route:cache
if %errorlevel% neq 0 (
    echo Erreur lors du cache des routes, nettoyage...
    php artisan route:clear
)
echo.

echo [6/7] Liste des routes auth...
php artisan route:list --path=api/auth
echo.

echo [7/7] Test direct de la route...
echo.
echo Test avec curl (si disponible)...
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" 2>nul || echo curl non disponible - utilisez votre navigateur
echo.

echo ========================================
echo INSTRUCTIONS FINALES
echo ========================================
echo.
echo 1. Demarrez le serveur Laravel:
echo    php artisan serve
echo.
echo 2. Dans un AUTRE terminal, testez:
echo    http://localhost:8000/api/auth/login
echo.
echo    Vous devriez voir une erreur JSON (normal, pas de donnees)
echo    MAIS PAS "route not found"
echo.
echo 3. Si vous voyez toujours "route not found":
echo    - Verifiez que php artisan serve tourne
echo    - Testez dans le navigateur: http://localhost:8000/api/auth/login
echo    - Vérifiez les logs: storage\logs\laravel.log
echo.
pause


