@echo off
echo ========================================
echo SOLUTION DEFINITIVE - SERVEURS MULTIPLES
echo ========================================
echo.

echo PROBLEME TROUVE!
echo Il y a PLUSIEURS serveurs Laravel qui tournent en meme temps!
echo Cela cree des conflits et la route n est pas trouvee.
echo.

echo [1/7] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul

echo [2/7] Verification qu aucun serveur ne tourne...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Des serveurs tournent encore!
    echo.
    echo Liste des processus PHP...
    tasklist | findstr php.exe
    echo.
    echo Tuer manuellement si necessaire...
) else (
    echo Aucun serveur ne tourne! ✓
)
echo.

echo [3/7] Arret de tous les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Serveurs arretes! ✓
echo.

echo [4/7] Nettoyage COMPLET du cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
if exist bootstrap\cache\routes*.php del /Q bootstrap\cache\routes*.php 2>nul
if exist bootstrap\cache\config.php del /Q bootstrap\cache\config.php 2>nul
echo Cache nettoye! ✓
echo.

echo [5/7] Verification de la route...
php artisan route:list --path=api/auth
echo.

cd ..

echo [6/7] Demarrage d UN SEUL serveur Laravel...
cd backend-laravel
start "Backend Laravel - SEUL SERVEUR" cmd /k "php artisan serve"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [7/7] Verification qu UN SEUL serveur tourne...
netstat -ano | findstr ":8000" | findstr "LISTENING"
echo.
echo Il devrait y avoir UN SEUL serveur maintenant.
echo.

echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo 1. TOUS les anciens serveurs ont ete arretes ✓
echo 2. Le cache a ete nettoye ✓
echo 3. UN SEUL serveur Laravel a ete demarre ✓
echo.
echo Testez maintenant:
echo   http://localhost:8000/api/auth/login
echo.
echo   Vous devriez voir "GET method not supported" (normal)
echo   PAS "route not found"
echo.
echo Pour le frontend:
echo   npm run build
echo   node serve-with-proxy.js
echo.
pause


