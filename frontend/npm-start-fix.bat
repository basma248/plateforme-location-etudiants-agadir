@echo off
echo ========================================
echo FIX npm start pour Node.js 24
echo ========================================
echo.

echo [1/4] Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/4] Configuration des variables d'environnement...
set NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-deprecation
set BROWSER=none
set PORT=3000
set SKIP_PREFLIGHT_CHECK=true
set GENERATE_SOURCEMAP=false
set FAST_REFRESH=true
set DISABLE_ESLINT_PLUGIN=true
set WATCHPACK_POLLING=true
set TSC_COMPILE_ON_ERROR=true
set ESLINT_NO_DEV_ERRORS=true

echo [3/4] Variables configurees
echo.

echo [4/4] Lancement de npm start...
echo.
echo ATTENDEZ 2-3 minutes pour la compilation...
echo Si ca reste bloque apres 5 minutes, le probleme vient de Node.js 24.
echo.
echo Solution alternative: Downgrade Node.js vers v20 LTS
echo.

call npm start


