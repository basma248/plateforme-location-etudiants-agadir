@echo off
echo ========================================
echo TEST ROUTE API /api/auth/login
echo ========================================
echo.

echo Test de la route avec curl (si disponible)...
echo.

curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}" 2>nul

echo.
echo.
echo Si vous voyez une erreur de validation (pas "route not found"), la route fonctionne!
echo.
echo Testez aussi dans votre navigateur:
echo   http://localhost:8000/api/auth/login
echo.
pause


