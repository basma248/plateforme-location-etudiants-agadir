@echo off
echo ========================================
echo FIX "Failed to fetch"
echo ========================================
echo.

echo PROBLEME: "Failed to fetch"
echo.
echo CAUSES POSSIBLES:
echo   1. Le serveur Laravel ne tourne pas
echo   2. Le proxy ne fonctionne pas
echo   3. Problème CORS
echo   4. Le frontend ne peut pas se connecter
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/7] Verification serveurs...
echo Laravel (port 8001):
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo ERREUR: Laravel ne tourne pas sur port 8001!
    echo Demarrage Laravel...
    cd backend-laravel
    start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
    timeout /t 3 /nobreak >nul
    cd ..
    echo Laravel demarre! ✓
) else (
    echo Laravel tourne! ✓
)
echo.

echo Frontend (port 3000):
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo ATTENTION: Le frontend ne tourne pas sur port 3000!
) else (
    echo Frontend tourne! ✓
)
echo.

echo [ETAPE 2/7] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel accessible!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel accessible! (erreur 422/401)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee (404)' -ForegroundColor Red } else { Write-Host 'ERREUR: Laravel non accessible' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [ETAPE 3/7] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 4/7] Verification CORS...
cd backend-laravel
findstr /C:"localhost:3000" config\cors.php
cd ..
echo.

echo [ETAPE 5/7] Arret des serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 6/7] Verification du build...
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

echo [ETAPE 7/7] Demarrage frontend avec proxy...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo IMPORTANT: Regardez les logs ci-dessous pour voir les erreurs.
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo Ouvrez la console (F12) pour voir les erreurs detaillees.
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js
