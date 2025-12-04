@echo off
echo ========================================
echo INSTALLATION EXPRESS ET PROXY
echo ========================================
echo.

echo Vous avez raison! Le probleme peut venir de la!
echo Express et http-proxy-middleware doivent etre installes.
echo.

echo [1/2] Verification des dependances...
if exist node_modules\express\package.json (
    echo Express est installe! ✓
) else (
    echo Express NON installe! ❌
)

if exist node_modules\http-proxy-middleware\package.json (
    echo http-proxy-middleware est installe! ✓
) else (
    echo http-proxy-middleware NON installe! ❌
)

echo.
echo [2/2] Installation des dependances manquantes...
echo.

npm install express http-proxy-middleware

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo INSTALLATION REUSSIE! ✓
    echo ========================================
    echo.
    echo Express et http-proxy-middleware sont maintenant installes!
    echo.
    echo Vous pouvez maintenant utiliser:
    echo   npm run build
    echo   node serve-with-proxy.js
    echo.
) else (
    echo.
    echo ERREUR lors de l'installation.
    echo Essayez: npm install
)

pause


