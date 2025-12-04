@echo off
echo ========================================
echo DIAGNOSTIC PROXY - Route not found
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1] Verification serveur Laravel...
netstat -ano | findstr ":8001" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo ERREUR: Laravel ne tourne pas sur port 8001!
    echo.
    echo Demarrez Laravel avec:
    echo   cd backend-laravel
    echo   php artisan serve --port=8001 --host=127.0.0.1
    pause
    exit /b 1
) else (
    echo Laravel tourne sur port 8001! ✓
)
echo.

echo [2] Test direct vers Laravel (sans proxy)...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel fonctionne directement!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel fonctionne! (erreur 422/401 = credentials invalides)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee dans Laravel (404)' -ForegroundColor Red } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [3] Test via le proxy (comme le frontend)...
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo ATTENTION: Le frontend ne tourne pas sur port 3000!
    echo.
    echo Demarrez le frontend avec:
    echo   set LARAVEL_URL=http://127.0.0.1:8001
    echo   node serve-with-proxy.js
    echo.
) else (
    echo Frontend tourne sur port 3000! ✓
    echo.
    echo Test via proxy...
    powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Le proxy fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Le proxy fonctionne! (erreur 422/401 = credentials invalides)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee via le proxy (404)' -ForegroundColor Red; Write-Host 'Le proxy ne redirige peut-etre pas correctement' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"
)
echo.

echo [4] Verification de la route dans Laravel...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
echo.

echo ========================================
echo CONCLUSION
echo ========================================
echo.
echo Si le test [2] fonctionne mais pas [3]:
echo   = Le proxy ne redirige pas correctement
echo   = Verifiez serve-with-proxy.js
echo.
echo Si le test [2] ne fonctionne pas:
echo   = Le probleme vient de Laravel
echo   = Verifiez la route dans api.php
echo.
pause


