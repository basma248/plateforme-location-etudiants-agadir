@echo off
echo ========================================
echo DEMARRAGE COMPLET - Frontend + Backend
echo ========================================
echo.

echo Cette solution va:
echo   1. Construire le frontend
echo   2. Demarrer le backend Laravel (si PHP est installe)
echo   3. Demarrer le frontend avec proxy
echo.

echo [1/4] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction du frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Verification de PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ATTENTION: PHP n'est pas trouve dans le PATH!
    echo.
    echo Le backend Laravel ne pourra pas demarrer automatiquement.
    echo.
    echo SOLUTIONS:
    echo   1. Installez PHP: https://www.php.net/downloads.php
    echo   2. Ou utilisez XAMPP/WAMP qui inclut PHP
    echo   3. Ou demarrez le backend manuellement dans un autre terminal
    echo.
    echo Le frontend va quand meme demarrer, mais les appels API echoueront
    echo si le backend n'est pas demarre.
    echo.
    pause
    goto :frontend_only
)

echo PHP trouve! Demarrage du backend...
echo.

echo [3/4] Demarrage du backend Laravel (nouveau terminal)...
start "Backend Laravel - Port 8000" cmd /k "cd /d %~dp0backend-laravel && php artisan serve"
timeout /t 3 /nobreak >nul

:frontend_only
echo [4/4] Demarrage du frontend...
echo.
echo Le frontend va demarrer sur http://localhost:3000
echo.
echo IMPORTANT:
echo   - Si le backend est demarre, les appels API fonctionneront
echo   - Si le backend n'est pas demarre, les appels API echoueront
echo.
echo Pour arreter, fermez les terminaux.
echo.

node serve-with-proxy.js


