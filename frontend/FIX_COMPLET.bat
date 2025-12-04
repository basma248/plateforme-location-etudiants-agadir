@echo off
echo ========================================
echo FIX COMPLET - Solution Finale
echo ========================================
echo.

echo PROBLEME: "The route auth/login could not be found"
echo.
echo CAUSES POSSIBLES:
echo   1. Plusieurs serveurs Laravel = conflits
echo   2. Le proxy pointe vers le mauvais port
echo   3. Le cache Laravel est obsolete
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/9] Arret de TOUS les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/9] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 3/9] Liberation des ports 8000 et 8001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Liberation du port 8000 - PID %%a...
    taskkill /F /PID %%a 2>nul >nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8001" ^| findstr "LISTENING"') do (
    echo Liberation du port 8001 - PID %%a...
    taskkill /F /PID %%a 2>nul >nul
)
timeout /t 2 /nobreak >nul
echo Ports liberes! ✓
echo.

echo [ETAPE 4/9] Nettoyage COMPLET du cache Laravel...
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

echo [ETAPE 5/9] Verification de la route /api/auth/login...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Route trouvee! ✓
echo.

echo [ETAPE 6/9] Mise a jour du proxy setupProxy.js pour port 8001...
powershell -Command "(Get-Content 'src\setupProxy.js') -replace 'http://localhost:8000', 'http://127.0.0.1:8001' | Set-Content 'src\setupProxy.js'"
echo Proxy mis a jour! ✓
echo.

echo [ETAPE 7/9] Demarrage d UN SEUL serveur Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre sur port 8001! ✓
echo.

echo [ETAPE 8/9] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 9/9] Demarrage du frontend avec proxy vers port 8001...
echo.
echo ========================================
echo ✅ APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy redirige /api vers http://127.0.0.1:8001/api
echo.
echo TESTEZ MAINTENANT:
echo   1. Ouvrez: http://localhost:3000
echo   2. Ouvrez la console (F12)
echo   3. Cliquez sur "Connexion"
echo   4. Entrez vos identifiants
echo   5. La connexion devrait fonctionner!
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js


