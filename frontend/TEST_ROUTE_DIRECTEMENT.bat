@echo off
echo ========================================
echo TEST ROUTE DIRECTEMENT
echo ========================================
echo.

echo Test de la route directement depuis le serveur Laravel...
echo.

cd backend-laravel

echo Test avec PowerShell...
powershell -Command "$body = @{email='test@test.com';password='test'} | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'SUCCESS! Route fonctionne!'; Write-Host ($response | ConvertTo-Json) } catch { Write-Host 'ERREUR:'; Write-Host $_.Exception.Message; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $responseBody = $reader.ReadToEnd(); Write-Host 'Response:'; Write-Host $responseBody } }"

echo.
echo.
echo Si vous voyez une erreur de validation (comme "email required")
echo   = La route FONCTIONNE! ✓
echo.
echo Si vous voyez "route not found"
echo   = Il y a encore un probleme
echo.
pause


