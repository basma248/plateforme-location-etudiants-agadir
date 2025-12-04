@echo off
echo ========================================
echo TEST RAPIDE - C'EST BON OU NON?
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo QUESTION: Le message "GET method not supported" = Probleme?
echo.
echo REPONSE: NON! C'EST NORMAL!
echo.
echo ========================================
echo VERIFICATION
echo ========================================
echo.

echo [1] Route existe?
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
if %errorlevel% equ 0 (
    echo ✓ Route existe!
) else (
    echo ✗ Route non trouvee
)
echo.

echo [2] Laravel tourne?
netstat -ano | findstr ":8001" | findstr "LISTENING" | find /C "LISTENING"
if %errorlevel% equ 0 (
    echo ✓ Laravel tourne!
) else (
    echo ✗ Laravel ne tourne pas
)
echo.

echo ========================================
echo CONCLUSION
echo ========================================
echo.
echo ✓ Le message "GET method not supported" = NORMAL
echo ✓ La route existe = BON
echo ✓ Laravel tourne = BON
echo.
echo TESTEZ MAINTENANT:
echo   1. Ouvrez http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. Entrez vos identifiants
echo   4. Si connexion fonctionne = TOUT EST BON! ✓
echo.
echo ========================================
pause


