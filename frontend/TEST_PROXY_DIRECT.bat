@echo off
echo ========================================
echo TEST PROXY DIRECT
echo ========================================
echo.

echo Test de la connexion directe avec le serveur Laravel sur port 8001...
echo.

powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test vers http://127.0.0.1:8001/api/auth/login...'; $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: La route fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: La route fonctionne! (erreur 422/401 = credentials invalides, mais la route existe)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee (404)' -ForegroundColor Red; Write-Host 'Verifiez que Laravel tourne sur le port 8001' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.
echo Test de la connexion avec le proxy...
echo.

powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; Write-Host 'Test vers http://localhost:3000/api/auth/login (via proxy)...'; $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: Le proxy fonctionne!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: Le proxy fonctionne! (erreur 422/401 = credentials invalides, mais le proxy redirige correctement)' -ForegroundColor Green } elseif ($statusCode -eq 404) { Write-Host 'ERREUR: Route non trouvee via le proxy (404)' -ForegroundColor Red; Write-Host 'Le proxy ne redirige peut-etre pas correctement' -ForegroundColor Yellow } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
pause
