@echo off
echo ========================================
echo Test de compilation React
echo ========================================
echo.

echo Arret des processus Node.js...
taskkill /F /IM node.exe 2>nul

echo.
echo Test de compilation en mode production...
echo Cela affichera toutes les erreurs...
echo.

call npm run build

echo.
echo ========================================
echo Si vous voyez des erreurs ci-dessus,
echo copiez-les et envoyez-les-moi.
echo ========================================
pause


