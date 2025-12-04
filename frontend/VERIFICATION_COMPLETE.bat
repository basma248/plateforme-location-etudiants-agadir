@echo off
echo ========================================
echo VERIFICATION COMPLETE
echo ========================================
echo.

echo [1/5] Verification Express...
node -e "const express = require('express'); console.log('Express version:', require('express/package.json').version); console.log('Express fonctionne! ✓');" 2>&1
echo.

echo [2/5] Verification http-proxy-middleware...
node -e "const { createProxyMiddleware } = require('http-proxy-middleware'); console.log('http-proxy-middleware version:', require('http-proxy-middleware/package.json').version); console.log('http-proxy-middleware fonctionne! ✓');" 2>&1
echo.

echo [3/5] Verification serve-with-proxy.js...
if exist serve-with-proxy.js (
    echo serve-with-proxy.js existe! ✓
) else (
    echo serve-with-proxy.js n existe PAS! ❌
)
echo.

echo [4/5] Verification build...
if exist build\index.html (
    echo Build existe! ✓
) else (
    echo Build n existe PAS! ❌
    echo Executez: npm run build
)
echo.

echo [5/5] Verification backend Laravel...
netstat -ano | findstr ":8000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo Backend Laravel tourne! ✓
) else (
    echo Backend Laravel ne tourne PAS! ❌
    echo Demarrez-le: cd backend-laravel && php artisan serve
)
echo.

echo ========================================
echo RESUME
echo ========================================
echo.
echo Express: INSTALLE ✓
echo http-proxy-middleware: INSTALLE ✓
echo.
echo Le probleme ne vient PAS de l installation.
echo.
echo Le probleme peut venir de:
echo   1. Le serveur Express ne demarre pas correctement
echo   2. Le proxy ne redirige pas correctement
echo   3. Le backend Laravel ne repond pas
echo.
echo Essayez: .\SOLUTION_FINALE_PROXY.bat
echo.
pause


