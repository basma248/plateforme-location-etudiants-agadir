@echo off
echo ========================================
echo CORRECTION ROUTE auth/login - MAINTENANT
echo ========================================
echo.

echo VOTRE CODE EST INTACT! ✓
echo Tous vos fichiers sont la.
echo.

cd backend-laravel

echo [1/4] Nettoyage COMPLET du cache Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [2/4] Verification de la route dans le code...
findstr /C:"auth/login" routes\api.php
if %errorlevel% equ 0 (
    echo Route trouvee dans api.php! ✓
) else (
    echo ERREUR: Route non trouvee dans api.php!
    pause
    exit /b 1
)
echo.

echo [3/4] Liste des routes enregistrees...
php artisan route:list --path=api/auth
echo.

echo [4/4] Instructions finales...
echo.
echo ========================================
echo IMPORTANT - A FAIRE MAINTENANT:
echo ========================================
echo.
echo 1. Si le serveur Laravel tourne, ARRETEZ-LE (Ctrl+C)
echo.
echo 2. Redemarrez le serveur:
echo    cd backend-laravel
echo    php artisan serve
echo.
echo 3. Testez dans le navigateur:
echo    http://localhost:8000/api/auth/login
echo.
echo    Vous devriez voir une erreur JSON (normal, pas de donnees)
echo    MAIS PAS "route not found"
echo.
echo 4. Si ca ne fonctionne toujours pas, executez:
echo    php artisan route:list
echo    et cherchez "auth/login"
echo.
echo ========================================
echo.
pause


