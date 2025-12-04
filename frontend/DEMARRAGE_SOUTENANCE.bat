@echo off
echo ========================================
echo DEMARRAGE POUR SOUTENANCE
echo ========================================
echo.

echo [1/3] Arret des processus Node.js existants...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Build de l'application...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERREUR lors du build!
    echo Verifiez les erreurs ci-dessus.
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage du serveur avec proxy...
echo.
echo ========================================
echo SERVEUR DEMARRE!
echo ========================================
echo.
echo Ouvrez: http://localhost:3000
echo.
echo IMPORTANT: Assurez-vous que Laravel est demarre sur http://localhost:8000
echo.
echo Pour arreter: Ctrl+C
echo.

node serve-with-proxy.js


