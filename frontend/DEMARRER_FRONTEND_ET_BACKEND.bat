@echo off
echo ========================================
echo DEMARRAGE COMPLET - Frontend + Backend
echo ========================================
echo.

echo Cette solution va demarrer:
echo   1. Backend Laravel sur http://localhost:8000
echo   2. Frontend React sur http://localhost:3000
echo.

echo [1/4] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction du frontend.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Recherche du backend Laravel...
if exist "..\backend-laravel\artisan" (
    set BACKEND_PATH=..\backend-laravel
) else if exist "backend-laravel\artisan" (
    set BACKEND_PATH=backend-laravel
) else (
    echo ERREUR: Backend Laravel non trouve!
    echo Cherchez le fichier "artisan" dans votre projet.
    pause
    exit /b 1
)

echo Backend trouve: %BACKEND_PATH%
echo.

echo [3/4] Demarrage du backend Laravel (nouveau terminal)...
start "Backend Laravel" cmd /k "cd /d %BACKEND_PATH% && php artisan serve"
timeout /t 3 /nobreak >nul

echo [4/4] Demarrage du frontend...
echo.
echo Le frontend va demarrer sur http://localhost:3000
echo Le backend est deja demarre sur http://localhost:8000
echo.
echo Pour arreter, fermez les deux terminaux.
echo.

node serve-with-proxy.js


