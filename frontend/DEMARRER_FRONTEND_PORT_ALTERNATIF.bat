@echo off
echo ========================================
echo DEMARRAGE DU FRONTEND - PORT ALTERNATIF
echo ========================================
echo.

echo Le port 3000 est occupe. Utilisation du port 3001...
echo.

echo [1/2] Verification du build...
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
echo [2/2] Demarrage du frontend sur le port 3001...
echo.
echo Le frontend va demarrer sur http://localhost:3001
echo Le backend est deja sur http://localhost:8000
echo.

set PORT=3001
node serve-with-proxy.js


