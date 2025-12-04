@echo off
echo ========================================
echo SOLUTION DEFINITIVE FINALE
echo ========================================
echo.

echo PROBLEME IDENTIFIE:
echo   - 4 serveurs Laravel tournent sur le port 8000 (conflits!)
echo   - Le proxy doit pointer vers un serveur propre
echo   - Solution: Utiliser le port 8001 (un seul serveur)
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/7] Arret de TOUS les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/7] Nettoyage COMPLET du cache Laravel...
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

echo [ETAPE 3/7] Verification de la route /api/auth/login...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
echo.

echo [ETAPE 4/7] Arret de tous les serveurs Laravel sur port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Tentative de tuer PID %%a...
    taskkill /F /PID %%a 2>nul >nul
)
timeout /t 2 /nobreak >nul
echo.

echo [ETAPE 5/7] Demarrage d UN SEUL serveur Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre sur port 8001! ✓
echo.

echo [ETAPE 6/7] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 7/7] Demarrage du frontend avec proxy vers port 8001...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001 (PORT 8001 - UN SEUL SERVEUR)
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
echo   5. La connexion devrait fonctionner!
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js
