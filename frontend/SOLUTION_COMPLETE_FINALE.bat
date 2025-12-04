@echo off
echo ========================================
echo SOLUTION COMPLETE FINALE
echo ========================================
echo.

echo PROBLEME IDENTIFIE:
echo   - 4 serveurs Laravel sur port 8000 = CONFLITS!
echo   - Le proxy peut pointer vers le mauvais serveur
echo   - Solution: UN SEUL serveur sur port 8001
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/8] Arret de TOUS les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/8] Arret de TOUS les serveurs PHP/Laravel...
taskkill /F /IM php.exe 2>nul >nul
timeout /t 3 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 3/8] Verification que les ports sont libres...
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Port 8000 encore utilise!
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a 2>nul >nul
    )
    timeout /t 2 /nobreak >nul
)
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Port 8001 encore utilise!
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8001" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a 2>nul >nul
    )
    timeout /t 2 /nobreak >nul
)
echo.

echo [ETAPE 4/8] Nettoyage COMPLET du cache Laravel...
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

echo [ETAPE 5/8] Verification de la route /api/auth/login...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee!
    pause
    exit /b 1
)
cd ..
echo Route trouvee! ✓
echo.

echo [ETAPE 6/8] Demarrage d UN SEUL serveur Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre sur port 8001! ✓
echo.

echo [ETAPE 7/8] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 8/8] Demarrage du frontend avec proxy vers port 8001...
echo.
echo ========================================
echo ✅ APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001 (UN SEUL SERVEUR)
echo.
echo Le proxy redirige /api vers http://127.0.0.1:8001/api
echo.
echo IMPORTANT: Le proxy utilise maintenant le port 8001
echo.
echo TESTEZ MAINTENANT:
echo   1. Ouvrez: http://localhost:3000
echo   2. Ouvrez la console (F12)
echo   3. Cliquez sur "Connexion"
echo   4. Entrez vos identifiants
echo   5. Regardez les logs du serveur Express ci-dessous
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js
