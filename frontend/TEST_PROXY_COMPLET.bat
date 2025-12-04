@echo off
echo ========================================
echo TEST PROXY COMPLET
echo ========================================
echo.

echo Le message que vous voyez est NORMAL si vous testez dans le navigateur.
echo Le navigateur fait GET, mais la route accepte POST.
echo.
echo Le VRAI test est de voir si le frontend peut se connecter.
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/5] Verification serveurs Laravel...
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING"
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [2/5] Test direct avec POST (comme le frontend)...
echo.
echo Test avec PowerShell...
powershell -Command "$body = @{email='test@test.com';password='test'} | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing; Write-Host 'SUCCESS: Route fonctionne avec POST!'; Write-Host ($response | ConvertTo-Json) } catch { Write-Host 'ERREUR:'; Write-Host $_.Exception.Message; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $responseBody = $reader.ReadToEnd(); Write-Host 'Response:'; Write-Host $responseBody } }"

echo.
echo.

echo [3/5] Verification du proxy...
if exist serve-with-proxy.js (
    echo serve-with-proxy.js existe! ✓
    findstr /C:"LARAVEL_URL" serve-with-proxy.js
) else (
    echo serve-with-proxy.js n'existe PAS! ❌
)
echo.

echo [4/5] Verification de l URL API dans le frontend...
findstr /C:"API_BASE_URL" src\services\authService.js
echo.

echo [5/5] Instructions...
echo.
echo ========================================
echo ANALYSE
echo ========================================
echo.
echo Si vous voyez "GET method not supported" dans le navigateur:
echo   = C EST NORMAL! Le navigateur fait GET, la route accepte POST.
echo.
echo Pour tester la connexion:
echo   1. Ouvrez http://localhost:3000
echo   2. Cliquez sur "Connexion"
echo   3. Regardez la console du navigateur (F12)
echo   4. Regardez les logs du serveur Express
echo.
echo Si vous voyez "route not found" lors de la connexion:
echo   = Le proxy ne redirige pas correctement.
echo.
pause
