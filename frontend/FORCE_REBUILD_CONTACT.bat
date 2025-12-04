@echo off
echo ========================================
echo FORCE REBUILD - Page de Contact
echo ========================================
echo.

cd C:\Users\Admin\plateforme-location-etudiants-agadir\frontend

echo [ETAPE 1/4] Arret des serveurs Node.js...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul
echo Termine! ✓
echo.

echo [ETAPE 2/4] Nettoyage du dossier build...
if exist build (
    rmdir /s /q build
    echo Dossier build supprime! ✓
) else (
    echo Dossier build n'existe pas. ✓
)
echo.

echo [ETAPE 3/4] Nettoyage du cache npm...
call npm cache clean --force 2>nul
echo Cache nettoye! ✓
echo.

echo [ETAPE 4/4] Reconstruction complete du build...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR lors de la construction du build!
    pause
    exit /b %errorlevel%
)
echo.
echo ========================================
echo BUILD RECONSTRUIT AVEC SUCCES! ✓
echo ========================================
echo.
echo Les modifications de la page de contact sont maintenant dans le build.
echo.
echo Pour demarrer le serveur, utilisez: .\SOLUTION_FINALE_API.bat
echo.
pause


