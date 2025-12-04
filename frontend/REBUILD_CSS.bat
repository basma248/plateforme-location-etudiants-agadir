@echo off
echo ========================================
echo REBUILD CSS - Application des modifications
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/2] Reconstruction du build React...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction du build!
    pause
    exit /b %errorlevel%
)
echo Build reconstruit avec succes! ✓
echo.

echo [ETAPE 2/2] Les modifications CSS sont maintenant dans le build!
echo.
echo IMPORTANT: Redemarrez votre serveur pour voir les changements.
echo            Utilisez: .\SOLUTION_FINALE_API.bat
echo.
pause


