@echo off
echo ========================================
echo SOLUTION DEFINITIVE - Route not found
echo ========================================
echo.

echo PROBLEME IDENTIFIE:
echo   - Le proxy pointait vers http://localhost:8000 par defaut
echo   - Mais Laravel tourne sur http://127.0.0.1:8001
echo   - SOLUTION: Corriger serve-with-proxy.js
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/5] Arret des serveurs...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/5] Verification route Laravel...
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

echo [ETAPE 3/5] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ETAPE 4/5] Verification du build...
if not exist build\index.html (
    echo Build n'existe pas. Construction...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERREUR lors de la construction.
        pause
        exit /b %errorlevel%
    )
    echo Build termine! ✓
) else (
    echo Build existe deja. ✓
)
echo.

echo [ETAPE 5/5] Demarrage frontend avec proxy CORRIGE...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy pointe maintenant vers http://127.0.0.1:8001
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.
echo Regardez les logs ci-dessous pour voir les requetes proxy.
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js
