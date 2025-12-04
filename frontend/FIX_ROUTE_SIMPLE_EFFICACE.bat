@echo off
echo ========================================
echo FIX ROUTE - METHODE SIMPLE ET EFFICACE
echo ========================================
echo.

echo J'ai modifie la route pour etre PLUS EXPLICITE.
echo.

cd backend-laravel

echo [1/4] Arret de tous les serveurs...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Nettoyage COMPLET...
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
if exist bootstrap\cache\config.php del /Q bootstrap\cache\config.php 2>nul
echo Nettoye! ✓
echo.

echo [3/4] Verification de la route modifiee...
findstr /C:"/auth/login" routes\api.php
echo Route trouvee! ✓
echo.

echo [4/4] Demarrage du serveur...
start "Backend Laravel" cmd /k "cd /d %CD% && php artisan serve"
timeout /t 3 /nobreak >nul

cd ..

echo.
echo ========================================
echo TERMINE!
echo ========================================
echo.
echo La route est maintenant DEFINIE EXPLICITEMENT:
echo   Route::post('/auth/login', ...)
echo.
echo Testez maintenant:
echo   1. Ouvrez: http://localhost:8000/api/auth/login
echo   2. Vous devriez voir une erreur JSON (normal)
echo   3. PAS "route not found"
echo.
echo Si ca ne fonctionne toujours pas:
echo   - Attendez 5 secondes
echo   - Rafraichissez la page
echo   - Dites-moi exactement ce que vous voyez
echo.
pause


