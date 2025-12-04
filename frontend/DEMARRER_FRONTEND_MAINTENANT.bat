@echo off
echo ========================================
echo DEMARRAGE DU FRONTEND
echo ========================================
echo.

echo Backend Laravel: http://localhost:8000 (DEJA DEMARRE) ✓
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
echo [2/2] Demarrage du frontend...
echo.
echo Le frontend va demarrer sur http://localhost:3000
echo Le backend est deja sur http://localhost:8000
echo.
echo Tout devrait fonctionner maintenant!
echo.

node serve-with-proxy.js


