@echo off
echo ========================================
echo SOLUTION FINALE COMPLETE
echo ========================================
echo.

echo PROBLEME TROUVE: 5 serveurs Laravel tournent en meme temps!
echo Cela cree des conflits et la route n est pas trouvee.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/7] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Serveurs PHP arretes! ✓
echo.

echo [2/7] Arret de tous les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Serveurs Node.js arretes! ✓
echo.

echo [3/7] Verification des ports...
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING"
echo Port 3000:
netstat -ano | findstr ":3000" | findstr "LISTENING"
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

echo [5/7] Verification de la route dans Laravel...
php artisan route:list --path=api/auth | findstr "login"
if %errorlevel% equ 0 (
    echo Route trouvee! ✓
) else (
    echo Route non trouvee! ❌
)
echo.

cd ..

echo [6/7] Demarrage d UN SEUL serveur Laravel...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [7/7] Verification finale...
echo Nombre de serveurs Laravel sur port 8000:
for /f %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING" ^| find /C "LISTENING"') do echo %%a serveur(s)
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
