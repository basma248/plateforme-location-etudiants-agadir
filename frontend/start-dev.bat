@echo off
echo ========================================
echo Demarrage du serveur de developpement
echo ========================================
echo.

echo Arret des processus Node.js existants...
taskkill /F /IM node.exe 2>nul >nul

echo.
echo Configuration de l'environnement...
set NODE_OPTIONS=--max-old-space-size=4096
set GENERATE_SOURCEMAP=false
set FAST_REFRESH=false
set SKIP_PREFLIGHT_CHECK=true
set BROWSER=none

echo.
echo Demarrage du serveur...
echo ATTENDEZ 3-5 MINUTES pour la compilation...
echo.

call npm start


