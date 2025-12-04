@echo off
echo ========================================
echo SOLUTION FINALE SIMPLE
echo ========================================
echo.

echo PROBLEME: Proxy ne s'active pas
echo SOLUTION: Proxy simple et robuste
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/6] Arret des serveurs...
taskkill /F /IM node.exe 2>nul >nul
taskkill /F /IM php.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/6] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 3/6] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 5 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ETAPE 4/6] Verification Laravel...
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo ERREUR: Laravel ne tourne pas!
    pause
    exit /b 1
)
echo Laravel tourne! ✓
echo.

echo [ETAPE 5/6] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel accessible!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel accessible! (erreur 422/401)' -ForegroundColor Green } else { Write-Host 'ERREUR: Laravel non accessible' -ForegroundColor Red } }"

echo.
echo.

echo [ETAPE 6/6] Verification du build...
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

echo ========================================
echo DEMARRAGE AVEC PROXY SIMPLE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy utilise maintenant serve-with-proxy-simple.js
echo Le proxy est applique AVANT tous les autres middlewares.
echo.
echo Vous devriez voir:
echo   [PROXY REQ] POST /api/auth/login
echo   [PROXY REQ] -> http://127.0.0.1:8001/api/auth/login
echo   [PROXY RES] 200 POST /api/auth/login
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy-simple.js
