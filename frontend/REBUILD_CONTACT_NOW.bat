@echo off
echo ========================================
echo REBUILD CONTACT PAGE - URGENT
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/3] Arret des serveurs...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo OK
echo.

echo [ETAPE 2/3] Suppression de l'ancien build...
if exist build (
    rmdir /s /q build
    echo Build supprime
) else (
    echo Pas de build existant
)
echo.

echo [ETAPE 3/3] Reconstruction du build...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors du build!
    pause
    exit /b %errorlevel%
)
echo.
echo ========================================
echo BUILD RECONSTRUIT AVEC SUCCES!
echo ========================================
echo.
echo Le nouveau design de la page de contact est maintenant dans le build.
echo.
echo IMPORTANT: Redemarrez votre serveur avec: .\SOLUTION_FINALE_API.bat
echo            Puis videz le cache du navigateur (Ctrl+F5)
echo.
pause


