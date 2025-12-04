@echo off
echo ========================================
echo FIX PROXY - Version Working
echo ========================================
echo.

echo PROBLEME: Les requetes arrivent mais le proxy ne redirige pas.
echo.
echo SOLUTION: Utiliser serve-with-proxy-working.js
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/5] Arret des serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/5] Verification Laravel...
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo Laravel ne tourne pas. Demarrage...
    cd backend-laravel
    start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
    timeout /t 3 /nobreak >nul
    cd ..
    echo Laravel demarre! ✓
) else (
    echo Laravel tourne! ✓
)
echo.

echo [ETAPE 3/5] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel accessible!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel accessible! (erreur 422/401)' -ForegroundColor Green } else { Write-Host 'ERREUR: Laravel non accessible' -ForegroundColor Red } }"

echo.
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

echo [ETAPE 5/5] Demarrage avec proxy WORKING...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy utilise maintenant serve-with-proxy-working.js
echo Vous devriez voir les logs [PROXY REQ] et [PROXY RES] ci-dessous.
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.
echo Regardez les logs pour voir:
echo   [PROXY REQ] POST /api/auth/login
echo   [PROXY REQ] -> http://127.0.0.1:8001/api/auth/login
echo   [PROXY RES] 200 POST /api/auth/login
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy-working.js


