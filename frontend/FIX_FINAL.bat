@echo off
echo ========================================
echo FIX FINAL - Solution Complete
echo ========================================
echo.

echo NOTE: Le message "GET method not supported" dans le navigateur est NORMAL!
echo       Le navigateur fait GET, mais la route accepte POST.
echo       Le VRAI test est de se connecter depuis le frontend.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/6] Arret de tous les serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/6] Nettoyage COMPLET du cache Laravel...
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

echo [ETAPE 3/6] Verification de la route /api/auth/login...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
echo.

echo [ETAPE 4/6] Demarrage Laravel sur PORT 8001 (port propre)...
cd backend-laravel
start "Backend Laravel - Port 8001" cmd /k "php artisan serve --port=8001"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre sur port 8001! ✓
echo.

echo [ETAPE 5/6] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [ETAPE 6/6] Demarrage du frontend avec proxy vers port 8001...
echo.
echo ========================================
echo ✅ APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8001
echo.
echo Le proxy redirige /api vers http://localhost:8001/api
echo.
echo TESTEZ MAINTENANT:
echo   1. Ouvrez: http://localhost:3000
echo   2. Ouvrez la console (F12)
echo   3. Cliquez sur "Connexion"
echo   4. Entrez vos identifiants
echo   5. Regardez les erreurs dans la console (si erreur)
echo.
echo ========================================
echo.

set LARAVEL_URL=http://localhost:8001
node serve-with-proxy.js


