@echo off
echo ========================================
echo DIAGNOSTIC PROXY COMPLET
echo ========================================
echo.

echo La route EXISTE dans Laravel: ✓
echo   POST api/auth/login -> AuthController@login
echo.
echo Le probleme vient donc du PROXY ou du FRONTEND.
echo.

echo [1/4] Verification backend Laravel...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Backend Laravel tourne! ✓
) else (
    echo Backend Laravel ne tourne PAS! ❌
    echo Demarrez-le: cd backend-laravel && php artisan serve
)
echo.

echo [2/4] Verification frontend...
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Frontend tourne! ✓
) else (
    echo Frontend ne tourne PAS! ❌
)
echo.

echo [3/4] Verification du proxy dans serve-with-proxy.js...
findstr /C:"/api" serve-with-proxy.js
if %errorlevel% equ 0 (
    echo Proxy configure! ✓
) else (
    echo Proxy NON configure! ❌
)
echo.

echo [4/4] Test direct du backend...
echo Testez: http://localhost:8000/api/auth/login
echo.
echo Si vous voyez "GET method not supported" = Backend fonctionne ✓
echo Si vous voyez "route not found" = Problème backend ❌
echo.

echo ========================================
echo SOLUTION
echo ========================================
echo.
echo Le proxy doit rediriger /api vers http://localhost:8000/api
echo.
echo Verifiez que:
echo   1. Le backend Laravel tourne sur http://localhost:8000
echo   2. Le frontend utilise /api (pas http://localhost:8000/api)
echo   3. Le proxy est actif dans serve-with-proxy.js
echo.
pause


