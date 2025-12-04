@echo off
echo ========================================
echo Reconstruction du design moderne...
echo ========================================
echo.

echo Suppression de l'ancien build...
if exist build rmdir /s /q build

echo.
echo Reconstruction avec npm run build...
call npm run build

echo.
echo ========================================
echo Reconstruction terminee!
echo ========================================
echo.
echo Redemarrez votre serveur avec:
echo .\SOLUTION_FINALE_API.bat
echo.
pause


