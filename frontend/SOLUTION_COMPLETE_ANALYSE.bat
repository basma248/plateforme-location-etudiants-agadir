@echo off
echo ========================================
echo SOLUTION COMPLETE - Analyse Approfondie
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ANALYSE 1/7] Version Node.js...
node --version
echo.

echo [ANALYSE 2/7] Verification route Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
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

echo [ANALYSE 3/7] Nettoyage cache Laravel...
cd backend-laravel
php artisan route:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
php artisan config:clear >nul 2>&1
cd ..
echo Cache nettoye! ✓
echo.

echo [ANALYSE 4/7] Arret des serveurs...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 1 /nobreak >nul
echo Termine! ✓
echo.

echo [ANALYSE 5/7] Demarrage Laravel sur port 8001...
cd backend-laravel
start "Backend Laravel" cmd /k "php artisan serve --port=8001 --host=127.0.0.1"
timeout /t 3 /nobreak >nul
cd ..
echo Serveur Laravel demarre! ✓
echo.

echo [ANALYSE 6/7] Test direct vers Laravel...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test POST vers http://127.0.0.1:8001/api/auth/login...' -ForegroundColor Cyan; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel fonctionne directement!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel fonctionne! (erreur 422/401 = credentials invalides)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee dans Laravel (404)' -ForegroundColor Red; Write-Host 'Le probleme vient de Laravel!' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [ANALYSE 7/7] Verification du build...
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
echo DEMARRAGE AVEC PROXY ROBUSTE
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8001
echo.
echo Le proxy utilise maintenant la version ROBUSTE avec logs detailles.
echo Regardez les logs ci-dessous pour voir exactement ce qui se passe.
echo.
echo TESTEZ: http://localhost:3000 (connexion)
echo.

set LARAVEL_URL=http://127.0.0.1:8001
node serve-with-proxy-robust.js


