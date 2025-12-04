@echo off
echo ========================================
echo Test npm start avec logs verboses
echo ========================================
echo.

echo Arret des processus Node.js existants...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo.
echo Creation du fichier .env optimise...
(
    echo SKIP_PREFLIGHT_CHECK=true
    echo GENERATE_SOURCEMAP=false
    echo FAST_REFRESH=true
    echo BROWSER=none
    echo PORT=3000
    echo TSC_COMPILE_ON_ERROR=true
    echo ESLINT_NO_DEV_ERRORS=true
    echo DISABLE_ESLINT_PLUGIN=true
) > .env

echo.
echo Fichier .env cree.
echo.
echo Lancement de npm start avec logs verboses...
echo ATTENDEZ 2-3 minutes pour voir les messages de compilation...
echo.

set DEBUG=*
set NODE_OPTIONS=--max-old-space-size=4096
call npm start


