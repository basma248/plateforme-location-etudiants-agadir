@echo off
echo ========================================
echo DEMARRAGE DU FRONTEND - FIX PORT 3000
echo ========================================
echo.

echo [1/3] Arret des processus Node.js utilisant le port 3000...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/3] Verification du build...
if not exist build\index.html (
    echo Build n'existe pas. Construction en cours...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERREUR lors de la construction.
        pause
        exit /b %errorlevel%
    )
    echo Build termine!
) else (
    echo Build existe deja.
)

echo.
echo [3/3] Demarrage du frontend...
echo.
echo Le frontend va demarrer sur http://localhost:3000
echo Le backend est deja sur http://localhost:8000
echo.

node serve-with-proxy.js


