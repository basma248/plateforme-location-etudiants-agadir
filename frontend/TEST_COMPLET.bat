@echo off
echo ========================================
echo TEST COMPLET - Verification
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [TEST 1/4] Le message que vous voyez est-il normal?
echo.
echo Vous voyez: "GET method not supported for route api/auth/login"
echo.
echo REPONSE: OUI, c'est NORMAL!
echo.
echo Explication:
echo   - Dans le navigateur, vous testez avec GET (methode par defaut)
echo   - Mais la route /api/auth/login accepte seulement POST
echo   - Le frontend envoie bien POST quand vous cliquez sur "Connexion"
echo.
echo ========================================
echo.

echo [TEST 2/4] Verification que la route existe...
cd backend-laravel
php artisan route:list | findstr /C:"auth/login"
cd ..
echo.
echo Si vous voyez "POST api/auth/login" ci-dessus, la route existe! ✓
echo.

echo [TEST 3/4] Verification des serveurs...
echo Port 8000:
netstat -ano | findstr ":8000" | findstr "LISTENING" | find /C "LISTENING"
echo Port 8001:
netstat -ano | findstr ":8001" | findstr "LISTENING" | find /C "LISTENING"
echo.
echo Si vous voyez 1 ou plus, Laravel tourne! ✓
echo.

echo [TEST 4/4] Test avec POST (comme le frontend)...
echo.
echo Test de connexion avec POST...
powershell -Command "$ErrorActionPreference='Stop'; try { $body = @{email='test@test.com';password='test'} | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'http://localhost:8001/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing 2>&1; Write-Host 'SUCCESS: La route fonctionne avec POST!' -ForegroundColor Green } catch { $statusCode = $_.Exception.Response.StatusCode.value__; if ($statusCode -eq 422 -or $statusCode -eq 401) { Write-Host 'SUCCESS: La route fonctionne! (erreur 422/401 = credentials invalides, mais la route existe)' -ForegroundColor Green } else { Write-Host 'ERREUR:' -ForegroundColor Red; Write-Host $_.Exception.Message } }"

echo.
echo.

echo ========================================
echo CONCLUSION
echo ========================================
echo.
echo Si TEST 2 affiche "POST api/auth/login":
echo   = La route existe! ✓
echo.
echo Si TEST 3 affiche 1 ou plus:
echo   = Laravel tourne! ✓
echo.
echo Si TEST 4 affiche "SUCCESS":
echo   = La route fonctionne avec POST! ✓
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


