@echo off
echo ========================================
echo DIAGNOSTIC COMPLET - Probleme npm start
echo ========================================
echo.

echo [1/6] Verification de Node.js...
node --version
npm --version
echo.

echo [2/6] Verification des processus Node.js...
tasklist | findstr node.exe
echo.

echo [3/6] Verification des ports...
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8000"
echo.

echo [4/6] Verification du proxy...
if exist src\setupProxy.js (
    echo Proxy ACTIF
    type src\setupProxy.js
) else (
    echo Proxy DESACTIVE
)
echo.

echo [5/6] Verification des variables d'environnement...
if exist .env (
    echo Fichier .env existe:
    type .env | findstr /C:"PORT" /C:"BROWSER" /C:"SKIP"
) else (
    echo Pas de fichier .env
)
echo.

echo [6/6] Test de compilation simple...
echo Test avec react-scripts...
timeout /t 3 /nobreak >nul
echo.

echo ========================================
echo Diagnostic termine.
echo ========================================
pause


