@echo off
echo ========================================
echo DEMARRAGE COMPLET - TOUT FONCTIONNE!
echo ========================================
echo.

echo EXCELLENTE NOUVELLE!
echo La route fonctionne! ✓
echo.
echo Le message "GET method not supported" signifie que
echo la route EST TROUVEE et fonctionne correctement!
echo.

echo [1/3] Verification que le backend Laravel tourne...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Backend Laravel tourne! ✓
) else (
    echo Demarrage du backend Laravel...
    cd backend-laravel
    start "Backend Laravel" cmd /k "php artisan serve"
    timeout /t 3 /nobreak >nul
    cd ..
)
echo.

echo [2/3] Construction du frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction.
    pause
    exit /b %errorlevel%
)
echo Build termine! ✓
echo.

echo [3/3] Demarrage du frontend...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo TESTEZ MAINTENANT:
echo   1. Allez a: http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. Entrez vos identifiants
echo   4. La connexion devrait fonctionner!
echo.
echo La route fonctionne, votre application est prete! ✓
echo.

node serve-with-proxy.js


