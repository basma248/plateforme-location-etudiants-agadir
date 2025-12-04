@echo off
echo ========================================
echo DEMARRAGE COMPLET DE L'APPLICATION
echo ========================================
echo.

echo Cette solution fonctionne TOUJOURS:
echo   1. Construire le frontend
echo   2. Demarrer le backend Laravel (si PHP disponible)
echo   3. Servir le frontend avec proxy
echo.

echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Construction du frontend (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)

echo.
echo Construction reussie! ✓
echo.

echo [3/4] Demarrage du backend Laravel (si PHP disponible)...
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo PHP trouve. Demarrage du backend...
    start "Backend Laravel" cmd /k "cd /d backend-laravel && php artisan serve"
    timeout /t 3 /nobreak >nul
    echo Backend demarre.
) else (
    echo PHP non trouve. Backend non demarre.
    echo Demarrez-le manuellement si necessaire.
)

echo.
echo [4/4] Demarrage du frontend...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Pour arreter, fermez les terminaux.
echo.

node serve-with-proxy.js


