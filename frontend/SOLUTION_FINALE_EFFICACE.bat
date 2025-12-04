@echo off
echo ========================================
echo SOLUTION FINALE EFFICACE
echo ========================================
echo.

echo J'AI MODIFIE LA ROUTE pour etre plus explicite.
echo La route est maintenant: Route::post('/auth/login', ...)
echo.

cd backend-laravel

echo [1/3] Arret de tous les serveurs PHP...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Serveurs arretes! ✓
echo.

echo [2/3] Nettoyage COMPLET du cache Laravel...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
if exist bootstrap\cache\config.php del /Q bootstrap\cache\config.php 2>nul
echo Cache nettoye! ✓
echo.

echo [3/3] Demarrage propre du serveur Laravel...
start "Backend Laravel" cmd /k "cd /d %CD% && php artisan serve"
timeout /t 3 /nobreak >nul
echo Serveur demarre! ✓
echo.

cd ..

echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo 1. La route a ete modifiee pour etre EXPLICITE
echo 2. Tous les caches ont ete nettoyes
echo 3. Le serveur Laravel a ete redemarre
echo.
echo TESTEZ MAINTENANT:
echo.
echo   Ouvrez votre navigateur et allez a:
echo   http://localhost:8000/api/auth/login
echo.
echo   Vous devriez voir une erreur JSON (normal, pas de donnees)
echo   MAIS PAS "route not found"
echo.
echo   Si vous voyez toujours "route not found":
echo   1. Attendez 5 secondes
echo   2. Rafraichissez la page (F5)
echo   3. Copiez TOUT le message d'erreur et envoyez-le moi
echo.
echo ========================================
echo.
pause


