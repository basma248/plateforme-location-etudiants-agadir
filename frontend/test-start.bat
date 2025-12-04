@echo off
echo ========================================
echo Test de demarrage React
echo ========================================
echo.

echo Arret des processus Node.js existants...
taskkill /F /IM node.exe 2>nul

echo.
echo Nettoyage du cache...
call npm cache clean --force

echo.
echo Demarrage du serveur...
echo ATTENDEZ 60-90 secondes pour la compilation...
echo.

call npm start

pause


