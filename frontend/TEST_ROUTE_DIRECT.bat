@echo off
echo ========================================
echo TEST DIRECT DE LA ROUTE auth/login
echo ========================================
echo.

echo Test de la route directement...
echo.

echo Ouvrez votre navigateur et allez a:
echo http://localhost:8000/api/auth/login
echo.
echo Si vous voyez:
echo   - Une erreur JSON (comme "validation error") = Route fonctionne! ✓
echo   - "route not found" = Problème de cache Laravel
echo.
echo Test avec PowerShell (si disponible)...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8000/api/auth/login' -Method POST -ContentType 'application/json' -Body '{\"email\":\"test@test.com\",\"password\":\"test\"}' -UseBasicParsing; Write-Host 'Status:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'Erreur:' $_.Exception.Message }" 2>nul || echo PowerShell non disponible - utilisez votre navigateur

pause


