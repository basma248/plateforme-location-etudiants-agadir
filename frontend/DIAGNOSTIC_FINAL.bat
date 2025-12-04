@echo off
echo ========================================
echo DIAGNOSTIC FINAL DU PROBLEME
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/6] Verification de la route Laravel...
cd backend-laravel
php artisan route:list --path=api/auth
cd ..
echo.

echo [2/6] Verification des ports en ecoute...
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING"
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING"
echo.

echo [3/6] Test direct avec POST (comme le frontend)...
echo Test avec PowerShell curl...
powershell -Command "$ErrorActionPreference='Stop'; $body = @{email='test@test.com';password='test'} | ConvertTo-Json; try { $response = Invoke-WebRequest -Uri 'http://localhost:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing; Write-Host 'SUCCESS: Route fonctionne avec POST!' } catch { Write-Host 'ERREUR:'; Write-Host $_.Exception.Message; $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $responseBody = $reader.ReadToEnd(); Write-Host 'Response:'; Write-Host $responseBody }"

echo.
echo.

echo [4/6] Verification de l'URL API dans authService.js...
findstr /C:"API_BASE_URL" src\services\authService.js
echo.

echo [5/6] Verification du proxy...
echo Configuration actuelle du proxy:
type serve-with-proxy.js | findstr /C:"LARAVEL_URL"
echo.

echo [6/6] Analyse...
echo.
echo ========================================
echo CONCLUSION
echo ========================================
echo.
echo Le message "GET method not supported" est NORMAL dans le navigateur.
echo Le navigateur fait GET, mais la route accepte POST.
echo.
echo Pour tester vraiment la connexion:
echo   1. Utilisez le script SOLUTION_DEFINITIVE.bat
echo   2. Ouvrez http://localhost:3000
echo   3. Cliquez sur "Connexion" et entrez vos identifiants
echo   4. Regardez la console du navigateur (F12) pour voir les erreurs
echo.
echo Si la connexion echoue, c'est probablement:
echo   - Le proxy ne redirige pas vers le bon port
echo   - Ou le serveur Laravel n'est pas accessible
echo.
pause


