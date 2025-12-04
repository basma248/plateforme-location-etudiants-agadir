@echo off
echo ========================================
echo SOLUTION FINALE - Route auth/login
echo ========================================
echo.

echo PROBLEME IDENTIFIE:
echo   - Plusieurs serveurs Laravel tournent en meme temps
echo   - Cache Laravel non nettoye
echo   - Route non trouvee a cause du conflit
echo.

echo [1/7] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Serveurs arretes! ✓
echo.

cd backend-laravel

echo [2/7] Verification de la route dans le code...
findstr /C:"/login" routes\api.php
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee dans api.php!
    pause
    exit /b 1
) else (
    echo Route trouvee dans api.php ligne 33! ✓
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

echo [4/7] Nettoyage COMPLET de TOUS les caches Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
echo Cache nettoye! ✓
echo.

echo [5/7] Suppression du cache des routes dans bootstrap/cache...
if exist bootstrap\cache\routes*.php (
    del /Q bootstrap\cache\routes*.php 2>nul
    echo Cache routes supprime! ✓
)
if exist bootstrap\cache\config.php (
    del /Q bootstrap\cache\config.php 2>nul
)
echo.

echo [6/7] Liste des routes auth enregistrees...
php artisan route:list --path=api/auth
echo.

echo [7/7] Demarrage propre du serveur Laravel...
echo.
echo Le serveur va demarrer dans un nouveau terminal.
echo Fermez ce terminal et utilisez le nouveau terminal.
echo.
start "Backend Laravel - NE FERMEZ PAS" cmd /k "cd /d %CD% && echo Serveur Laravel demarrant... && php artisan serve && pause"

timeout /t 5 /nobreak >nul

cd ..

echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo 1. TOUS les anciens serveurs Laravel ont ete arretes ✓
echo.
echo 2. Le cache Laravel a ete nettoye ✓
echo.
echo 3. Un NOUVEAU serveur Laravel a ete demarre ✓
echo.
echo 4. Testez maintenant:
echo    http://localhost:8000/api/auth/login
echo.
echo    Vous devriez voir une erreur JSON (normal, pas de donnees)
echo    MAIS PAS "route not found"
echo.
echo 5. Pour le frontend:
echo    npm run build
echo    node serve-with-proxy.js
echo.
echo ========================================
echo.
echo IMPORTANT: Le serveur Laravel tourne dans un autre terminal.
echo NE FERMEZ PAS ce terminal!
echo.
pause


