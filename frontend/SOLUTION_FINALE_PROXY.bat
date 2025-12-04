@echo off
echo ========================================
echo SOLUTION FINALE - PROXY EXPRESS
echo ========================================
echo.

echo J'ai ameliore le proxy Express avec:
echo   - Logging detaille des requetes
echo   - Gestion d'erreurs amelioree
echo   - Headers CORS automatiques
echo   - Timeout configure
echo.

echo [1/5] Arret de TOUS les serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Serveurs arretes! ✓
echo.

echo [2/5] Verification des ports...
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8000"
echo.

echo [3/5] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
cd ..
echo Cache nettoye! ✓
echo.

echo [4/5] Demarrage backend Laravel...
cd backend-laravel
start "Backend Laravel - IMPORTANT" cmd /k "php artisan serve"
timeout /t 5 /nobreak >nul
cd ..
echo Backend demarre! ✓
echo.

echo [5/5] Construction et demarrage frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo.
echo ========================================
echo SERVEUR EXPRESS AVEC PROXY AMELIORE
echo ========================================
echo.
echo Le proxy est maintenant AMELIORE avec:
echo   - Logging de toutes les requetes
echo   - Gestion d'erreurs robuste
echo   - Headers CORS automatiques
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Dans la console, vous verrez:
echo   [PROXY] POST /api/auth/login -&gt; http://localhost:8000/api/auth/login
echo.
echo TESTEZ MAINTENANT:
echo   1. Allez a: http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. Regardez les logs dans cette console
echo   4. La connexion devrait fonctionner!
echo.
echo ========================================
echo.

node serve-with-proxy.js


