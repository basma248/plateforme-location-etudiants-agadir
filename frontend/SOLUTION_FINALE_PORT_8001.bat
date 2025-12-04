@echo off
echo ========================================
echo SOLUTION FINALE - PORT 8001
echo ========================================
echo.

echo Les processus sur le port 8000 ne peuvent pas etre tues.
echo Solution: Utiliser le port 8001 pour Laravel.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/5] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
cd ..
echo Cache nettoye! ✓
echo.

echo [2/5] Verification que le port 8001 est libre...
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Le port 8001 est deja utilise, utilisation du port 8002...
    set LARAVEL_PORT=8002
) else (
    echo Port 8001 est libre! ✓
    set LARAVEL_PORT=8001
)
echo.

echo [3/5] Demarrage Laravel sur port %LARAVEL_PORT%...
cd backend-laravel
start "Backend Laravel - Port %LARAVEL_PORT%" cmd /k "php artisan serve --port=%LARAVEL_PORT%"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre sur port %LARAVEL_PORT%! ✓
echo.

echo [4/5] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [5/5] Demarrage du frontend avec proxy...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:%LARAVEL_PORT%
echo.
echo Le proxy pointe vers le port %LARAVEL_PORT%.
echo.
echo TESTEZ MAINTENANT:
echo   1. Allez a: http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. La connexion devrait fonctionner!
echo.

set LARAVEL_URL=http://localhost:%LARAVEL_PORT%
node -e "const fs = require('fs'); let content = fs.readFileSync('serve-with-proxy.js', 'utf8'); content = content.replace(/http:\/\/localhost:8000/g, '%LARAVEL_URL%'); fs.writeFileSync('serve-with-proxy-temp.js', content);"
node serve-with-proxy-temp.js


