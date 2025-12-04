@echo off
echo ========================================
echo TEST CONNEXION - Requete POST
echo ========================================
echo.

echo La route fonctionne! ✓
echo.
echo Testons avec une requete POST (comme le frontend)...
echo.

cd backend-laravel

echo Test avec curl (si disponible)...
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" 2>nul

if %errorlevel% neq 0 (
    echo.
    echo curl non disponible.
    echo.
    echo Utilisez PowerShell pour tester:
    echo.
    echo powershell -Command "$body = @{email='test@test.com';password='test'} | ConvertTo-Json; Invoke-RestMethod -Uri 'http://localhost:8000/api/auth/login' -Method POST -Body $body -ContentType 'application/json'"
)

echo.
echo.
echo ========================================
echo RESULTAT ATTENDU
echo ========================================
echo.
echo Si vous voyez une erreur de validation (comme "email required")
echo   = La route FONCTIONNE! ✓
echo.
echo Si vous voyez "route not found"
echo   = Il y a encore un probleme
echo.
pause


