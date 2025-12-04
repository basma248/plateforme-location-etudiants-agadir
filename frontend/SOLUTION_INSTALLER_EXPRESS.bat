@echo off
echo ========================================
echo SOLUTION - INSTALLER EXPRESS
echo ========================================
echo.

echo VOUS AVEZ RAISON!
echo Si Express n est pas installe, le serveur ne peut pas fonctionner!
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [1/3] Verification des dependances...
echo.

if exist node_modules\express\package.json (
    echo Express: INSTALLE ✓
) else (
    echo Express: NON INSTALLE ❌
    set EXPRESS_MISSING=1
)

if exist node_modules\http-proxy-middleware\package.json (
    echo http-proxy-middleware: INSTALLE ✓
) else (
    echo http-proxy-middleware: NON INSTALLE ❌
    set PROXY_MISSING=1
)

echo.

if defined EXPRESS_MISSING (
    echo ========================================
    echo PROBLÈME TROUVÉ!
    echo ========================================
    echo.
    echo Express n est PAS installe!
    echo C est probablement la cause du probleme!
    echo.
    echo Installation en cours...
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
        echo ERREUR lors de l installation.
        echo Essayez: npm install
    )
) else if defined PROXY_MISSING (
    echo http-proxy-middleware manquant, installation...
    npm install http-proxy-middleware
) else (
    echo Toutes les dependances sont installees! ✓
    echo.
    echo Le probleme vient peut-etre d autre chose.
    echo Verifiez que node_modules existe bien.
)

echo.
pause


