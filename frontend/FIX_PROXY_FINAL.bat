@echo off
echo ========================================
echo FIX PROXY FINAL - Route not found
echo ========================================
echo.

echo PROBLEME: "The route auth/login could not be found"
echo.
echo CAUSE POSSIBLE: Le proxy ne redirige pas correctement
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/6] Arret des serveurs...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/6] Verification route Laravel...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
if %errorlevel% neq 0 (
    echo ERREUR: Route non trouvee dans Laravel!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Route trouvee! ✓
echo.

echo [ETAPE 3/6] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ETAPE 4/6] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ETAPE 5/6] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel fonctionne! (erreur 422/401 = credentials invalides)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee dans Laravel (404)' -ForegroundColor Red; Write-Host 'Le probleme vient de Laravel, pas du proxy' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [ETAPE 6/6] Demarrage frontend avec proxy...
echo.
echo IMPORTANT: Le proxy doit pointer vers http://127.0.0.1:8001
echo.
echo ========================================
echo APPLICATION DEMARRÉE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Regardez les logs ci-dessous pour voir les requetes proxy.
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy.js


