@echo off
echo ========================================
echo Demarrage du serveur React
echo ========================================
echo.

echo Arret des processus Node.js existants...
taskkill /F /IM node.exe 2>nul

echo.
echo Demarrage du serveur...
echo ATTENDEZ 2-3 MINUTES pour la compilation...
echo.

timeout /t 5 /nobreak >nul

start http://localhost:3000

call npm start


