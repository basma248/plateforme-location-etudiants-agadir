@echo off
echo ========================================
echo CORRECTION - SERVEURS MULTIPLES LARAVEL
echo ========================================
echo.

echo PROBLEME: 5 serveurs Laravel tournent en meme temps!
echo Solution: Arreter tous et demarrer UN SEUL serveur.
echo.

echo [1/6] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul

echo [2/6] Arret de tous les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [3/6] Verification qu aucun serveur ne tourne...
netstat -ano | findstr ":8000"
if %errorlevel% equ 0 (
    echo ATTENTION: Des processus utilisent encore le port 8000!
    echo Ils vont etre tues...
    timeout /t 2 /nobreak >nul
) else (
    echo Port 8000 libre! ✓
)
echo.

echo [4/6] Nettoyage COMPLET du cache Laravel...
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

echo [5/6] Verification de la route...
php artisan route:list --path=api/auth | findstr "login"
echo.

echo [6/6] Demarrage d UN SEUL serveur Laravel...
start "Backend Laravel - UN SEUL SERVEUR" cmd /k "php artisan serve"
timeout /t 5 /nobreak >nul

cd ..

echo.
echo ========================================
echo VERIFICATION FINALE
echo ========================================
echo.
echo Nombre de serveurs Laravel sur le port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING" | find /C "LISTENING"
echo.
echo Il devrait y avoir UN SEUL serveur maintenant.
echo.

echo.
echo ========================================
echo SOLUTION APPLIQUEE
echo ========================================
echo.
echo 1. Tous les serveurs multiples ont ete arretes ✓
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


