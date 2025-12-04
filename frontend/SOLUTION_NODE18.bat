@echo off
echo ========================================
echo SOLUTION AVEC NODE.JS 18
echo ========================================
echo.

echo Si le probleme persiste avec Node.js 20, essayez Node.js 18 LTS.
echo.

echo [ETAPE 1/3] Verification version Node.js actuelle...
node --version
echo.

echo [ETAPE 2/3] Instructions pour Node.js 18:
echo.
echo 1. Telechargez Node.js 18 LTS:
echo    https://nodejs.org/en/download/
echo    (Choisissez la version 18.x.x LTS)
echo.
echo 2. Installez Node.js 18 (remplacez Node.js 20)
echo.
echo 3. Verifiez la version:
echo    node --version
echo    (Devrait afficher v18.x.x)
echo.
echo 4. Reinstallez les dependances:
echo    npm install
echo.
echo 5. Executez SOLUTION_COMPLETE_ANALYSE.bat
echo.

echo [ETAPE 3/3] Solution alternative avec Node.js actuel...
echo.
echo Si vous ne voulez pas changer Node.js, utilisez:
echo   .\SOLUTION_COMPLETE_ANALYSE.bat
echo.
echo Ce script utilise serve-with-proxy-robust.js avec logs detailles.
echo.

pause


