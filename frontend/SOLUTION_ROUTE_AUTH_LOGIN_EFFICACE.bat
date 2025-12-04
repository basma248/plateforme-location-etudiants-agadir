@echo off
echo ========================================
echo SOLUTION EFFICACE - Route auth/login
echo ========================================
echo.

echo Le probleme vient de plusieurs serveurs Laravel qui tournent.
echo Cette solution va tout corriger.
echo.

echo [1/8] Arret de TOUS les serveurs Laravel et PHP...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Serveurs arretes! ✓
echo.

cd backend-laravel

echo [2/8] Verification de la route dans le code...
findstr /C:"/login" routes\api.php | findstr /C:"auth"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee dans api.php!
    pause
    exit /b 1
) else (
    echo Route trouvee dans api.php! ✓
)
echo.

echo [3/8] Verification du controle AuthController...
if exist app\Http\Controllers\AuthController.php (
    echo AuthController existe! ✓
) else (
    echo ERREUR: AuthController n'existe pas!
    pause
    exit /b 1
)
echo.

echo [4/8] Nettoyage COMPLET de TOUS les caches Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [5/8] Suppression du cache des routes (si existe)...
if exist bootstrap\cache\routes*.php (
    del /Q bootstrap\cache\routes*.php 2>nul
    echo Cache routes supprime! ✓
)
echo.

echo [6/8] Verification des routes enregistrees...
php artisan route:list --path=api/auth
echo.

echo [7/8] Demarrage propre du serveur Laravel...
echo Le serveur va demarrer sur http://localhost:8000
echo.
start "Backend Laravel" cmd /k "cd /d %CD% && php artisan serve"
timeout /t 3 /nobreak >nul
echo Serveur demarre! ✓
echo.

cd ..

echo [8/8] Instructions finales...
echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo 1. Le serveur Laravel est demarre sur http://localhost:8000
echo.
echo 2. Testez la route dans votre navigateur:
echo    http://localhost:8000/api/auth/login
echo.
echo    Vous devriez voir une erreur JSON (normal, pas de donnees)
echo    MAIS PAS "route not found"
echo.
echo 3. Si vous voyez toujours "route not found":
echo    - Attendez 5 secondes que le serveur demarre completement
echo    - Rafraichissez la page
echo    - Verifiez les logs: backend-laravel\storage\logs\laravel.log
echo.
echo 4. Pour le frontend:
echo    npm run build
echo    node serve-with-proxy.js
echo.
echo ========================================
echo.
pause


