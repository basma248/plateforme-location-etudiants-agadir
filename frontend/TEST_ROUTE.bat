@echo off
echo ========================================
echo TEST DE LA ROUTE /api/auth/login
echo ========================================
echo.

echo Le message "GET method not supported" dans le navigateur = NORMAL!
echo Le navigateur fait GET, mais la route accepte POST.
echo.
echo Testons avec POST (comme le frontend)...
echo.

powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test POST vers http://127.0.0.1:8001/api/auth/login...' -ForegroundColor Cyan; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: La route fonctionne avec POST!' -ForegroundColor Green; Write-Host 'Status:' $response.StatusCode -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: La route fonctionne!' -ForegroundColor Green; Write-Host 'Status:' $statusCode '= Credentials invalides (normal, mais la route existe!)' -ForegroundColor Yellow } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee (404)' -ForegroundColor Red; Write-Host 'Verifiez que Laravel tourne sur le port 8001' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.
echo ========================================
echo CONCLUSION
echo ========================================
echo.
echo Si vous voyez "SUCCESS" ci-dessus:
echo   = La route fonctionne! ✓
echo   = Le probleme est CORRIGE! ✓
echo.
echo Si vous voyez "ERREUR: Route non trouvee (404)":
echo   = Le serveur Laravel ne tourne pas ou le port est incorrect
echo.
echo LE VRAI TEST:
echo   1. Ouvrez http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. Entrez vos identifiants
echo   4. Si la connexion fonctionne = TOUT EST BON! ✓
echo.
echo Le message "GET method not supported" dans le navigateur = NORMAL!
echo.
pause


