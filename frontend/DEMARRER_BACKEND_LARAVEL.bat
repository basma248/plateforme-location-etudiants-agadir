@echo off
echo ========================================
echo DEMARRAGE DU BACKEND LARAVEL
echo ========================================
echo.

echo [1/3] Recherche du backend Laravel...
echo.

REM Essayer plusieurs emplacements possibles
if exist "..\backend-laravel\artisan" (
    set BACKEND_PATH=..\backend-laravel
    echo Backend trouve: %BACKEND_PATH%
    goto :found
)

if exist "backend-laravel\artisan" (
    set BACKEND_PATH=backend-laravel
    echo Backend trouve: %BACKEND_PATH%
    goto :found
)

if exist "..\..\backend-laravel\artisan" (
    set BACKEND_PATH=..\..\backend-laravel
    echo Backend trouve: %BACKEND_PATH%
    goto :found
)

echo ERREUR: Backend Laravel non trouve!
echo.
echo Cherchez le fichier "artisan" dans votre projet.
echo Il devrait etre dans un dossier comme "backend-laravel" ou "backend".
pause
exit /b 1

:found
echo.
echo [2/3] Verification de PHP...
php --version
if %errorlevel% neq 0 (
    echo.
    echo ERREUR: PHP n'est pas installe ou pas dans le PATH!
    echo.
    echo Installez PHP ou ajoutez-le au PATH.
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage du serveur Laravel...
echo.
echo Le serveur va demarrer sur http://localhost:8000
echo.
echo IMPORTANT: Laissez ce terminal ouvert!
echo.
echo Pour arreter le serveur, appuyez sur Ctrl+C
echo.

cd /d %BACKEND_PATH%
php artisan serve


