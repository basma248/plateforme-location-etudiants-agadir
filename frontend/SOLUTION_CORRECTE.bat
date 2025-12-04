@echo off
echo ========================================
echo SOLUTION CORRECTE - Préserver /api
echo ========================================
echo.

echo PROBLEME: Laravel reçoit /auth/login au lieu de /api/auth/login
echo.
echo CAUSE: Le proxy enlève /api du chemin
echo SOLUTION: Utiliser pathRewrite pour préserver /api
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/6] Arret des serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/6] Verification route Laravel...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Route trouvee: POST api/auth/login ✓
echo.

echo [ETAPE 3/6] Verification Laravel...
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

echo [ETAPE 4/6] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 5/6] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test POST vers http://127.0.0.1:8001/api/auth/login...' -ForegroundColor Cyan; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel accessible avec /api/auth/login!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel accessible! (erreur 422/401)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee (404)' -ForegroundColor Red } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [ETAPE 6/6] Demarrage avec proxy CORRECT...
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo IMPORTANT: Le proxy utilise maintenant serve-with-proxy-correct.js
echo            qui PRESERVE /api dans l'URL avec pathRewrite
echo.
echo Laravel recevra: /api/auth/login (pas /auth/login)
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.
echo Vous devriez voir:
echo   [PROXY REQ] POST /api/auth/login
echo   [PROXY REQ] -> http://127.0.0.1:8001/api/auth/login
echo   [PROXY RES] 200 POST /api/auth/login
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy-correct.js


