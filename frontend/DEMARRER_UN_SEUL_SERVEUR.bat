@echo off
echo ========================================
echo DEMARRER UN SEUL SERVEUR LARAVEL
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/4] Verification que le port 8000 est libre...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo ATTENTION: Le port 8000 est deja utilise!
    echo.
    echo Executez d'abord: .\TUER_TOUS_SERVEURS_LARAVEL.bat
    pause
    exit /b 1
) else (
    echo Port 8000 est libre! ✓
)
echo.

echo [2/4] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear
php artisan cache:clear
php artisan config:clear
cd ..
echo Cache nettoye! ✓
echo.

echo [3/4] Verification de la route...
cd backend-laravel
php artisan route:list --path=api/auth | findstr "login"
cd ..
echo.

echo [4/4] Demarrage d UN SEUL serveur Laravel...
cd backend-laravel
start "Backend Laravel - UN SEUL" cmd /k "php artisan serve"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur demarre! ✓
echo.

echo.
echo ========================================
echo VERIFICATION
echo ========================================
echo.
echo Nombre de serveurs Laravel sur port 8000:
for /f %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING" ^| find /C "LISTENING"') do echo %%a serveur(s)
echo.
echo Il devrait y avoir UN SEUL serveur maintenant.
echo.
echo Testez: http://localhost:8000/api/auth/login
echo Vous devriez voir "GET method not supported" (normal)
echo.
pause


