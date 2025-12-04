@echo off
echo ========================================
echo VERIFICATION DU STATUT
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1] Route Laravel /api/auth/login existe?
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
echo.

echo [2] Serveurs Laravel actifs:
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING"
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [3] Serveur Express (frontend) actif?
netstat -ano | findstr ":3000" | findstr "LISTENING"
echo.

echo ========================================
echo REPONSES
echo ========================================
echo.
echo 1. Si vous voyez "POST api/auth/login" = Route existe! ✓
echo.
echo 2. Si vous voyez des lignes LISTENING = Laravel tourne! ✓
echo.
echo 3. Si vous voyez une ligne sur port 3000 = Frontend tourne! ✓
echo.
echo ========================================
echo.
echo LE MESSAGE "GET method not supported" = NORMAL!
echo.
echo Testez depuis http://localhost:3000 (connexion)
echo.
pause


