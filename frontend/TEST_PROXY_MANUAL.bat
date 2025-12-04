@echo off
echo ========================================
echo TEST MANUEL DU PROXY
echo ========================================
echo.

echo Ce script teste le proxy manuellement pour identifier le probleme.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [TEST 1] Laravel fonctionne directement?
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Laravel fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Laravel fonctionne! (erreur 422/401)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee dans Laravel (404)' -ForegroundColor Red } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo [TEST 2] Le frontend tourne?
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% neq 0 (
    echo Le frontend ne tourne pas. Demarrez-le d'abord.
    pause
    exit /b 1
)
echo Frontend tourne! ✓
echo.

echo [TEST 3] Test via le proxy...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test POST vers http://localhost:3000/api/auth/login (via proxy)...' -ForegroundColor Cyan; $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Le proxy fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Le proxy fonctionne! (erreur 422/401)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee via le proxy (404)' -ForegroundColor Red; Write-Host 'Le proxy ne redirige pas correctement!' -ForegroundColor Yellow; Write-Host 'Regardez les logs du serveur Express pour plus de details.' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo ========================================
echo DIAGNOSTIC
echo ========================================
echo.
echo Si TEST 1 fonctionne mais pas TEST 3:
echo   = Le proxy ne redirige pas correctement
echo   = Utilisez serve-with-proxy-robust.js avec logs detailles
echo.
echo Si TEST 1 ne fonctionne pas:
echo   = Le probleme vient de Laravel
echo   = Verifiez les routes et le cache
echo.
pause


